"use client";

import { NewsletterItem } from "@/app/page";

interface Props {
  title: string;
  actionItems: NewsletterItem[];
  infoItems: NewsletterItem[];
  onToggle: (index: number) => void;
  onBack: () => void;
}

export default function ParentView({
  title,
  actionItems,
  infoItems,
  onToggle,
  onBack,
}: Props) {
  const completedCount = actionItems.filter((i) => i.checked).length;
  const allDone = actionItems.length > 0 && completedCount === actionItems.length;

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-5">
      {/* Newsletter card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Card header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-5 text-white">
          <p className="text-indigo-200 text-xs mb-1">{today}</p>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-indigo-200 text-sm mt-1">
            ○○ 어린이집에서 안내드립니다
          </p>
        </div>

        {/* Progress bar for action items */}
        {actionItems.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-100 bg-amber-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-amber-700">
                📌 확인 필요 사항
              </span>
              <span className="text-xs text-amber-600 font-medium">
                {completedCount}/{actionItems.length} 완료
              </span>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${actionItems.length > 0 ? (completedCount / actionItems.length) * 100 : 0}%`,
                }}
              />
            </div>
            {allDone && (
              <p className="text-xs text-amber-600 mt-2 font-medium">
                🎉 모든 항목을 확인하셨습니다!
              </p>
            )}
          </div>
        )}

        <div className="px-6 py-5 space-y-6">
          {/* Action required items */}
          {actionItems.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-amber-700 mb-3">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-100 rounded-full text-xs">!</span>
                부모님 확인·행동이 필요한 사항
              </h3>
              <ul className="space-y-3">
                {actionItems.map((item) => (
                  <li key={item.index}>
                    <label className="flex gap-3 cursor-pointer group">
                      <div className="mt-0.5 shrink-0">
                        <div
                          onClick={() => onToggle(item.index)}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            item.checked
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300 group-hover:border-amber-400 bg-white"
                          }`}
                        >
                          {item.checked && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1" onClick={() => onToggle(item.index)}>
                        <p
                          className={`text-sm leading-relaxed text-gray-800 transition-all ${
                            item.checked ? "line-through text-gray-400" : ""
                          }`}
                        >
                          {item.text}
                        </p>
                        {item.actionSummary && (
                          <p className="text-xs text-amber-600 mt-1 font-medium">
                            → {item.actionSummary}
                          </p>
                        )}
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Divider */}
          {actionItems.length > 0 && infoItems.length > 0 && (
            <hr className="border-gray-100" />
          )}

          {/* Info-only items */}
          {infoItems.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full text-xs">ℹ</span>
                참고 공지사항
              </h3>
              <ul className="space-y-3">
                {infoItems.map((item) => (
                  <li
                    key={item.index}
                    className="flex gap-3"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            궁금한 사항은 담임 선생님께 문의해 주세요 😊
          </p>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="w-full py-3.5 rounded-2xl border-2 border-indigo-200 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-all"
      >
        ← 내용 수정하기
      </button>
    </div>
  );
}
