/**
 * StrategySelector
 * Componente para exibir e selecionar opções de estratégia geradas pela IA.
 * Exibe um card por opção com título, descrição, público-alvo e mensagem chave.
 */

"use client";

import { StrategyOption } from "@/app/services/campaigns";
import { CheckCircle, Target, MessageSquare } from "lucide-react";

type Props = {
  strategies: StrategyOption[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  saving: boolean;
};

export function StrategySelector({ strategies, selectedIndex, onSelect, saving }: Props) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <p style={{
        fontWeight: 600, color: "rgba(255,255,255,0.85)",
        fontSize: 14, marginBottom: 4,
      }}>
        Escolha a estratégia que melhor representa sua campanha:
      </p>

      {strategies.map((s, i) => {
        const isSelected = selectedIndex === i;

        return (
          <button
            key={i}
            onClick={() => !saving && onSelect(i)}
            disabled={saving}
            style={{
              background: isSelected
                ? "rgba(253,143,6,0.18)"
                : "rgba(255,255,255,0.07)",
              border: `2px solid ${isSelected ? "#FD8F06" : "rgba(255,255,255,0.15)"}`,
              borderRadius: 14,
              padding: "16px 18px",
              cursor: saving ? "not-allowed" : "pointer",
              textAlign: "left",
              transition: "all 0.2s",
              width: "100%",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              if (!isSelected && !saving)
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              if (!isSelected)
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
            }}
            aria-pressed={isSelected}
          >
            {/* Título */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: isSelected ? "rgba(253,143,6,0.3)" : "rgba(255,255,255,0.1)",
                display: "grid", placeItems: "center",
                transition: "background 0.2s",
              }}>
                {isSelected
                  ? <CheckCircle size={13} color="#FD8F06" />
                  : <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.35)", display: "block" }} />
                }
              </div>
              <strong style={{ color: "#fff", fontSize: 14, lineHeight: 1.3 }}>
                {s.title}
              </strong>
            </div>

            {/* Descrição */}
            <p style={{
              color: "rgba(255,255,255,0.72)", fontSize: 13,
              lineHeight: 1.6, marginBottom: s.targetAudience || s.keyMessage ? 10 : 0,
            }}>
              {s.description}
            </p>

            {/* Público + Mensagem chave */}
            {(s.targetAudience || s.keyMessage) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {s.targetAudience && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: "rgba(255,255,255,0.08)", borderRadius: 20,
                    padding: "4px 10px", fontSize: 12, color: "rgba(255,255,255,0.65)",
                  }}>
                    <Target size={11} /> {s.targetAudience}
                  </div>
                )}
                {s.keyMessage && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: "rgba(255,255,255,0.08)", borderRadius: 20,
                    padding: "4px 10px", fontSize: 12, color: "rgba(255,255,255,0.65)",
                  }}>
                    <MessageSquare size={11} /> {s.keyMessage}
                  </div>
                )}
              </div>
            )}
          </button>
        );
      })}

      {saving && (
        <p style={{
          textAlign: "center", color: "rgba(255,255,255,0.55)",
          fontSize: 13, paddingTop: 4,
        }}>
          Aplicando estratégia...
        </p>
      )}
    </div>
  );
}
