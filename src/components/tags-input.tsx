"use client";

import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ETIQUETAS_PREDEFINIDAS } from "@/types";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export default function TagsInput({ value, onChange, className }: TagsInputProps) {
  const [inputVal, setInputVal] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addTag = (tag: string) => {
    const t = tag.trim().startsWith("#") ? tag.trim() : `#${tag.trim()}`;
    if (t.length > 1 && !value.includes(t)) {
      onChange([...value, t]);
    }
    setInputVal("");
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputVal.trim()) addTag(inputVal);
    } else if (e.key === "Backspace" && !inputVal && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const filteredSuggestions = ETIQUETAS_PREDEFINIDAS.filter(
    (t) => t.toLowerCase().includes(inputVal.toLowerCase()) && !value.includes(t)
  );

  return (
    <div className={cn("relative", className)}>
      <div className="min-h-[48px] flex flex-wrap gap-2 p-2 bg-slate-800 border border-slate-600 rounded-lg focus-within:border-green-500 transition-colors">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-1 bg-green-900/60 text-green-300 text-sm rounded-full border border-green-700/50"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKey}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={value.length === 0 ? "#RompeAlEspacio, #Falso9..." : "Añadir etiqueta..."}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-slate-200 text-sm placeholder:text-slate-500"
        />
      </div>

      {/* Sugerencias */}
      {showSuggestions && (inputVal.length > 0 || value.length === 0) && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2">
            <p className="text-xs text-slate-500 mb-2 px-1">Etiquetas sugeridas</p>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
              {filteredSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-green-900/50 text-slate-300 hover:text-green-300 text-xs rounded-full border border-slate-600 hover:border-green-700 transition-all"
                >
                  <Plus size={10} />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
