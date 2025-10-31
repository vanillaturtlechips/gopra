// frontend/scripts/sync.mjs
import fs from 'fs';
import path from 'path';
import postgres from 'postgres'; // ⬅️ 1. fetch 대신 postgres 임포트

// 2. 환경 변수 로드
const {
  POSTGRES_URL, // ⬅️ DB URL을 직접 사용 (Vercel 환경변수에 이미 있음)
  VERCEL_GIT_REPO_OWNER,
  VERCEL_GIT_REPO_SLUG,
  CONTENT_ROOT_PATH,
} = process.env;

// (사용자가 정의한 카테고리 목록)
const TARGET_CATEGORIES = [
  'devops',
  'GOlang',
  'DataBase',
  'Network',
  'Operating-System',
  'Data-Structure-and-Algorithm'
];

// 3. GitHub 링크 생성을 위한 기본 URL
const GITHUB_BASE_URL = `https://github.com/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}/blob/main`;

// 4. 콘텐츠 폴더 경로 설정
const CONTENT_DIR = path.join(process.cwd(), '..', CONTENT_ROOT_PATH);

/**
 * 로컬 파일 시스템 스캔 (이 함수는 수정 없음)
 */
function getLocalFiles() {
  console.log(`Scanning for .md files in: ${CONTENT_DIR}`);
  const files = [];

  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn(`Content directory not found: ${CONTENT_DIR}. Skipping local file scan.`);
    return [];
  }

  for (const category of TARGET_CATEGORIES) {
    const categoryDir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;

    const mdFiles = fs.readdirSync(categoryDir).filter(
      file => file.endsWith('.md') && !file.endsWith('README.md')
    );

    for (const file of mdFiles) {
      const relativePath = `${CONTENT_ROOT_PATH}/${category}/${file}`;
      files.push({
        title: file.replace('.md', ''),
        category: category,
        linkUrl: `${GITHUB_BASE_URL}/${relativePath}`,
        content: '', // 요약글 없음
      });
    }
  }
  console.log(`Found ${files.length} .md files locally.`);
  return files;
}

/**
 * ⬅️ 5. DB에서 직접 게시물 목록을 가져오도록 수정
 */
async function getDatabasePosts(sql) {
  console.log('Fetching posts directly from Vercel DB...');
  try {
    // ⚠️ 이전 로그에서 'cannot scan NULL' 오류가 있었습니다.
    //    만약 Neon에서 DELETE FROM posts WHERE category IS NULL;
    //    를 실행했다면 아래 쿼리를,
    //    아니라면 COALESCE 쿼리를 사용하세요.
    
    // [해결책 A (DB 초기화)를 썼을 경우]
    const posts = await sql`SELECT id, title, category, link_url as "linkUrl" FROM posts`;

    // [해결책 B (Go 코드 수정)를 썼거나, NULL이 걱정될 경우]
    // const posts = await sql`
    //   SELECT id, title, 
    //          COALESCE(category, '') as category, 
    //          COALESCE(link_url, '') as "linkUrl" 
    //   FROM posts
    // `;

    console.log(`Found ${posts.length} posts in DB.`);
    return posts;
  } catch (e) {
    console.error('Error fetching from DB:', e.message);
    return [];
  }
}

/**
 * 메인 동기화 로직
 */
async function syncPortfolio() {
  console.log('--- Starting Portfolio Sync ---');

  // 6. ⚠️ API 토큰 대신 DB URL 확인
  const missingVars = [
    !POSTGRES_URL && 'POSTGRES_URL',
    !VERCEL_GIT_REPO_OWNER && 'VERCEL_GIT_REPO_OWNER',
    !VERCEL_GIT_REPO_SLUG && 'VERCEL_GIT_REPO_SLUG',
    !CONTENT_ROOT_PATH && 'CONTENT_ROOT_PATH'
  ].filter(Boolean);

  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(', ')}. Aborting sync.`);
    if (process.env.NODE_ENV !== 'development') process.exit(1);
    console.warn('Continuing build without sync (likely local dev)...');
    return;
  }

  // 7. ⬅️ DB 연결 (Vercel 빌드 환경은 SSL이 필요함)
  const sql = postgres(POSTGRES_URL, { ssl: 'require' });

  const [localFiles, dbPosts] = await Promise.all([
    getLocalFiles(),
    getDatabasePosts(sql),
  ]);

  const localMap = new Map(localFiles.map(f => [f.linkUrl, f]));
  const dbMap = new Map(dbPosts.map(p => [p.linkUrl, p]));

  const postsToAdd = localFiles.filter(f => !dbMap.has(f.linkUrl));
  const postsToDelete = dbPosts.filter(p => !localMap.has(p.linkUrl));

  // 8. ⬅️ '추가' 작업 (직접 INSERT)
  for (const post of postsToAdd) {
    console.log(`[+] ADDING: ${post.title} (Category: ${post.category})`);
    try {
      await sql`
        INSERT INTO posts (title, content, category, link_url)
        VALUES (${post.title}, ${post.content}, ${post.category}, ${post.linkUrl})
      `;
    } catch (e) {
      console.error(`Failed to add ${post.title}:`, e.message);
    }
  }

  // 9. ⬅️ '삭제' 작업 (직접 DELETE)
  for (const post of postsToDelete) {
    console.log(`[-] DELETING: ${post.title} (ID: ${post.id})`);
    try {
      await sql`
        DELETE FROM posts WHERE id = ${post.id}
      `;
    } catch (e) {
      console.error(`Failed to delete ${post.title}:`, e.message);
    }
  }
  
  // 10. ⬅️ DB 연결 종료
  await sql.end();

  console.log('--- Sync Complete ---');
}

// 스크립트 실행
await syncPortfolio();