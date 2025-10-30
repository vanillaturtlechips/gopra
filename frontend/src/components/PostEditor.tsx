// 1. ChangeEvent, FormEvent 앞에 'type' 키워드 추가
import { useState, useRef, type ChangeEvent, type FormEvent } from 'react'

// PostEditor 컴포넌트가 부모(App)에게 "새 글이 생성됨!"을 알리기 위한 타입
interface PostEditorProps {
  onPostCreated: () => void;
}

// 2. Go API를 아직 만들지 않았으므로, 이 인터페이스는 일단 주석 처리합니다.
// (나중에 'api/upload.go' 만들 때 주석을 해제할 것입니다.)
/*
interface PresignedUploadResponse {
  uploadUrl: string; // Vercel Blob에 업로드할 1회용 URL
  finalUrl: string;  // 업로드가 완료된 후의 최종 이미지 주소
}
*/

export default function PostEditor({ onPostCreated }: PostEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 1. 폼 제출 핸들러
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }), // id는 DB가 자동 생성
      });

      if (!response.ok) {
        throw new Error('게시글 등록에 실패했습니다.');
      }

      // 성공
      setTitle('');
      setContent('');
      onPostCreated(); // 부모(App)에게 새 글이 등록되었음을 알림
      
      alert('게시글이 성공적으로 등록되었습니다!');

    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 2. 이미지 업로드 핸들러
   */
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // --- (임시) 현재는 Go API가 없으므로 가짜 URL로 시뮬레이션 ---
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      const finalUrl = `https://placehold.co/600x400?text=${file.name}`;
      // --- 임시 코드 끝 ---
      
      const markdownImage = `\n![${file.name}](${finalUrl})\n`;
      insertTextAtCursor(markdownImage);

    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 업로드 실패');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * 3. 텍스트 에디터의 현재 커서 위치에 텍스트를 삽입하는 헬퍼 함수
   */
  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = content.substring(0, start) + text + content.substring(end);
    
    setContent(newText);

    setTimeout(() => {
      textarea.selectionStart = start + text.length;
      textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // 4. 이제 .tsx 파일이므로 JSX 문법이 정상적으로 인식됩니다.
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 제목 입력 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          제목
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="게시글 제목을 입력하세요"
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-3"
        />
      </div>

      {/* 본문 입력 (마크다운) */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-300">
          내용 (Markdown 지원)
        </label>
        {/* 5. TextareaAutosize 대신 표준 textarea 사용 */}
        <textarea
          id="content"
          ref={textareaRef} // ref 연결
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 마크다운 형식으로 입력하세요..."
          rows={10} // minRows 대신 rows 사용
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-3 font-mono"
        />
      </div>

      {/* 이미지 업로드 버튼 */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
        >
          {isUploading ? '업로드 중...' : '이미지 첨부'}
        </button>
        {isUploading && <span className="ml-4 text-sm text-gray-400">이미지 처리 중...</span>}
      </div>

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="rounded-md bg-red-900/50 p-4">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* 제출 버튼 */}
      <div className="text-right">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
        >
          {isSubmitting ? '등록 중...' : '게시글 등록'}
        </button>
      </div>
    </form>
  );
}

