"use client";

import { useState } from "react";
import TeacherView from "@/components/TeacherView";
import ParentView from "@/components/ParentView";
import { ClassifiedItem } from "@/app/api/classify/route";

export type NewsletterItem = ClassifiedItem & { checked: boolean };

export default function Home() {
  const [tab, setTab] = useState<"teacher" | "parent">("teacher");
  const [items, setItems] = useState<NewsletterItem[]>([]);
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawItems, setRawItems] = useState<string[]>([]);

  const generateNewsletter = async (
    inputItems: string[],
    newsletterTitle: string
  ) => {
    if (inputItems.length === 0) return;
    setIsGenerating(true);
    setError(null);
    setTitle(newsletterTitle);
    setRawItems(inputItems);

    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: inputItems }),
      });

      if (!res.ok) throw new Error("분류 중 오류가 발생했습니다");

      const data = await res.json();
      const classified: ClassifiedItem[] = data.classified;
      const withChecked: NewsletterItem[] = classified.map((item) => ({
        ...item,
        checked: false,
      }));
      setItems(withChecked);
      setTab("parent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleCheck = (index: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.index === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const actionItems = items.filter((i) => i.requiresAction);
  const infoItems = items.filter((i) => !i.requiresAction);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-indigo-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-3xl">📋</span>
          <div>
            <h1 className="text-xl font-bold text-indigo-700">
              가정통신문 작성 도우미
            </h1>
            <p className="text-xs text-gray-500">
              어린이집 선생님을 위한 스마트 가정통신문
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          <button
            onClick={() => setTab("teacher")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "teacher"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            ✏️ 선생님 작성
          </button>
          <button
            onClick={() => setTab("parent")}
            disabled={items.length === 0}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              tab === "parent"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            👨‍👩‍👧 부모님 미리보기
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        {tab === "teacher" ? (
          <TeacherView
            onGenerate={generateNewsletter}
            isGenerating={isGenerating}
            initialItems={rawItems}
            initialTitle={title}
          />
        ) : (
          <ParentView
            title={title}
            actionItems={actionItems}
            infoItems={infoItems}
            onToggle={toggleCheck}
            onBack={() => setTab("teacher")}
          />
        )}
      </div>
    </div>
  );
}
