// frontend/scripts/sync.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postgres from 'postgres';

// ES Module에서 __dirname 구하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  POSTGRES_URL,
  VERCEL_GIT_REPO_OWNER,
  VERCEL_GIT_REPO_SLUG,
  CONTENT_ROOT_PATH,
} = process.env;

// 🔥 실제 폴더명과 일치하도록 수정 (대소문자 주의!)
const TARGET_CATEGORIES = [
  'Devops',     // ⬅️ 대문자 D
  'GOlang',
  'DataBase',
  'Network',
  'Operating-System',
  'Data-Structure-and-Algorithm'
];

const GITHUB_BASE_URL = `https://github.com/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}/blob/main`;

// 🔥 경로 수정: frontend/scripts/ 에서 프로젝트 루트로 이동
// frontend/scripts/sync.mjs → 프로젝트 루트
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const CONTENT_DIR = path.join(PROJECT_ROOT, CONTENT_ROOT_PATH || 'study-content');

console.log('📂 Project Root:', PROJECT_ROOT);
console.log('📂 Content Directory:', CONTENT_DIR);

/**
 * 로컬 파일 시스템 스캔
 */
function getLocalFiles() {
  console.log(`\n🔍 Scanning for .md files in: ${CONTENT_DIR}`);
  const files = [];

  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn(`⚠️  Content directory not found: ${CONTENT_DIR}`);
    console.warn(`⚠️  Available directories in project root:`);
    try {
      const rootDirs = fs.readdirSync(PROJECT_ROOT, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      console.warn(`    ${rootDirs.join(', ')}`);
    } catch (e) {
      console.error('Failed to list directories:', e.message);
    }
    return [];
  }

  for (const category of TARGET_CATEGORIES) {
    const categoryDir = path.join(CONTENT_DIR, category);
    
    if (!fs.existsSync(categoryDir)) {
      console.log(`⏭️  Skipping non-existent category: ${category}`);
      continue;
    }

    const mdFiles = fs.readdirSync(categoryDir).filter(
      file => file.endsWith('.md') && !file.toLowerCase().includes('readme')
    );

    console.log(`📁 ${category}: found ${mdFiles.length} files`);

    for (const file of mdFiles) {
      const relativePath = `${CONTENT_ROOT_PATH || 'study-content'}/${category}/${file}`;
      files.push({
        title: file.replace('.md', ''),
        category: category,
        linkUrl: `${GITHUB_BASE_URL}/${relativePath}`,
        content: '',
      });
    }
  }
  
  console.log(`✅ Total found: ${files.length} .md files\n`);
  return files;
}

/**
 * DB에서 게시물 목록 가져오기
 */
async function getDatabasePosts(sql) {
  console.log('🔍 Fetching posts from database...');
  try {
    const posts = await sql`
      SELECT id, title, category, link_url as "linkUrl" 
      FROM posts
    `;
    console.log(`✅ Found ${posts.length} posts in DB\n`);
    return posts;
  } catch (e) {
    console.error('❌ Error fetching from DB:', e.message);
    return [];
  }
}

/**
 * 메인 동기화 로직
 */
async function syncPortfolio() {
  console.log('\n==============================================');
  console.log('🚀 Starting Portfolio Sync');
  console.log('==============================================\n');

  // 환경 변수 확인
  const missingVars = [
    !POSTGRES_URL && 'POSTGRES_URL',
    !VERCEL_GIT_REPO_OWNER && 'VERCEL_GIT_REPO_OWNER',
    !VERCEL_GIT_REPO_SLUG && 'VERCEL_GIT_REPO_SLUG',
  ].filter(Boolean);

  if (missingVars.length > 0) {
    console.error(`❌ Missing environment variables: ${missingVars.join(', ')}`);
    console.error('⚠️  Aborting sync.\n');
    if (process.env.NODE_ENV !== 'development') process.exit(1);
    console.warn('⚠️  Continuing build without sync (local dev mode)...\n');
    return;
  }

  console.log('✅ Environment variables validated\n');

  // DB 연결
  const sql = postgres(POSTGRES_URL, { ssl: 'require' });

  try {
    const [localFiles, dbPosts] = await Promise.all([
      getLocalFiles(),
      getDatabasePosts(sql),
    ]);

    const localMap = new Map(localFiles.map(f => [f.linkUrl, f]));
    const dbMap = new Map(dbPosts.map(p => [p.linkUrl, p]));

    const postsToAdd = localFiles.filter(f => !dbMap.has(f.linkUrl));
    const postsToDelete = dbPosts.filter(p => !localMap.has(p.linkUrl));

    console.log('📊 Sync Summary:');
    console.log(`   • Local files: ${localFiles.length}`);
    console.log(`   • DB posts: ${dbPosts.length}`);
    console.log(`   • To add: ${postsToAdd.length}`);
    console.log(`   • To delete: ${postsToDelete.length}\n`);

    // 추가 작업
    if (postsToAdd.length > 0) {
      console.log('➕ Adding posts to DB:\n');
      for (const post of postsToAdd) {
        console.log(`   [+] ${post.category}/${post.title}`);
        try {
          await sql`
            INSERT INTO posts (title, content, category, link_url)
            VALUES (${post.title}, ${post.content}, ${post.category}, ${post.linkUrl})
          `;
        } catch (e) {
          console.error(`   ❌ Failed to add ${post.title}:`, e.message);
        }
      }
      console.log('');
    }

    // 삭제 작업
    if (postsToDelete.length > 0) {
      console.log('➖ Removing posts from DB:\n');
      for (const post of postsToDelete) {
        console.log(`   [-] ${post.title} (ID: ${post.id})`);
        try {
          await sql`DELETE FROM posts WHERE id = ${post.id}`;
        } catch (e) {
          console.error(`   ❌ Failed to delete ${post.title}:`, e.message);
        }
      }
      console.log('');
    }

    if (postsToAdd.length === 0 && postsToDelete.length === 0) {
      console.log('✨ Everything is already in sync!\n');
    }

  } finally {
    await sql.end();
  }

  console.log('==============================================');
  console.log('✅ Sync Complete');
  console.log('==============================================\n');
}

// 스크립트 실행
await syncPortfolio();