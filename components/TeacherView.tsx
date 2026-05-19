"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  onGenerate: (items: string[], title: string) => void;
  isGenerating: boolean;
  initialItems: string[];
  initialTitle: string;
}

export default function TeacherView({
  onGenerate,
  isGenerating,
  initialItems,
  initialTitle,
}: Props) {
  const [title, setTitle] = useState(initialTitle || "");
  const [items, setItems] = useState<string[]>(
    initialItems.length > 0 ? initialItems : [""]
  );
  const lastInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialItems.length > 0) setItems(initialItems);
    if (initialTitle) setTitle(initialTitle);
  }, [initialItems, initialTitle]);

  const updateItem = (index: number, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, ""]);
    setTimeout(() => lastInputRef.current?.focus(), 50);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      setItems([""]);
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (index === items.length - 1) {
        addItem();
      }
    }
  };

  const handleGenerate = () => {
    const filled = items.filter((item) => item.trim().length > 0);
    if (filled.length === 0) return;
    onGenerate(filled, title || "어린이집 가정통신문");
  };

  const filledItems = items.filter((i) => i.trim().length > 0);
  const canGenerate = filledItems.length > 0 && !isGenerating;

  return (
    <div className="space-y-5">
      {/* Title input */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📌 가정통신문 제목
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 5월 가정통신문"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder-gray-400 text-base"
        />
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-gray-700">
            📝 전달 내용 입력
          </label>
          <span className="text-xs text-gray-400">
            {filledItems.length}개 항목
          </span>
        </div>

        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          각 칸에 전달할 내용을 하나씩 입력해주세요.
          AI가 자동으로 &quot;부모님 행동 필요&quot;와 &quot;참고 공지&quot;로 분류합니다.
        </p>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="mt-3 text-xs font-bold text-gray-400 w-5 text-center shrink-0">
                {index + 1}
              </span>
              <textarea
                ref={index === items.length - 1 ? lastInputRef : undefined}
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder={
                  index === 0
                    ? "예: 4월 20일까지 현장학습 동의서를 제출해주세요."
                    : index === 1
                    ? "예: 5월 5일은 어린이날로 어린이집 휴원합니다."
                    : "내용을 입력하세요..."
                }
                rows={2}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder-gray-400 text-sm resize-none leading-relaxed"
              />
              <button
                onClick={() => removeItem(index)}
                className="mt-2.5 p-1.5 text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
                aria-label="삭제"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="mt-3 w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-indigo-300 hover:text-indigo-400 transition-all text-sm font-medium"
        >
          + 항목 추가
        </button>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={`w-full py-4 rounded-2xl text-white font-semibold text-base shadow-sm transition-all ${
          canGenerate
            ? "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            AI가 분류 중입니다...
          </span>
        ) : (
          "✨ 가정통신문 생성하기"
        )}
      </button>
    </div>
  );
}
