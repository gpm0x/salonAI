"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  IconBrain,
  IconSend,
  IconSparkles,
  IconUser,
  IconImage,
  IconX,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  image?: string | null;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    content: "Olá! Sou a Inteligência Artificial do Salon AI. Como posso ajudar com os insights do seu salão hoje? Você também pode me enviar imagens de relatórios ou do ambiente para analisarmos juntos.",
  }
];

const SUGGESTIONS = [
  "Qual o faturamento do dia?",
  "Quais profissionais estão ociosos?",
  "Mostrar oportunidades de receita",
  "Resumo dos clientes inativos"
];

export function InteligenciaView() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, selectedImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
    // Reset the input so the same file can be selected again if needed
    e.target.value = "";
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleSend = (text: string) => {
    if (!text.trim() && !selectedImage) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      image: selectedImage,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSelectedImage(null);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: userMsg.image 
          ? "Recebi a imagem! Estou processando as informações contidas nela para te dar um retorno preciso. (Simulação)" 
          : "Nesta versão beta, estou analisando os dados do seu salão para gerar os melhores insights. (Este é um texto de exemplo para demonstrar a interface de chat!)",
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    // `dvh` e não `vh`: no celular a barra de endereço entra e sai da tela, e
    // `100vh` mede sempre a altura MAIOR — o compositor de mensagem ficava
    // abaixo da dobra o tempo todo. O piso evita que o chat vire uma fresta
    // em telas baixas na horizontal.
    <div className="mx-auto flex h-[calc(100dvh-8rem)] min-h-[26rem] max-w-5xl animate-fade-up flex-col gap-4">
      {/* Cabeçalho */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-soft text-gold shadow-inner">
            <IconBrain width={24} height={24} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl text-ink">
                Assistente IA
              </h1>
              <Badge tone="accent">
                <IconSparkles width={12} height={12} />
                Beta
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-muted">
              Pergunte sobre seus dados, envie imagens e receba análises avançadas.
            </p>
          </div>
        </div>
      </div>

      {/* Área Principal do Chat */}
      <Card className="flex flex-1 flex-col overflow-hidden bg-bg/40 backdrop-blur-md">
        {/* Mensagens */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-full gap-3",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-1",
                  msg.role === "user" 
                    ? "bg-ink text-bg" 
                    : "bg-primary text-primary-fg"
                )}
              >
                {msg.role === "user" ? <IconUser width={16} height={16} /> : <IconBrain width={16} height={16} />}
              </div>

              {/* Balão de Mensagem */}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                  msg.role === "user"
                    ? "rounded-tr-none bg-ink text-bg"
                    : "rounded-tl-none border border-line bg-surface text-ink"
                )}
              >
                {msg.image && (
                  <div className="mb-2 overflow-hidden rounded-xl">
                    <img 
                      src={msg.image} 
                      alt="Imagem enviada" 
                      className="max-h-60 w-auto object-contain"
                    />
                  </div>
                )}
                {msg.content && <div>{msg.content}</div>}
              </div>
            </div>
          ))}

          {/* Indicador de Digitação */}
          {isTyping && (
            <div className="flex w-full flex-row gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg mt-1">
                <IconBrain width={16} height={16} />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none border border-line bg-surface px-4 py-3 shadow-sm">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-soft [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-soft [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-soft"></span>
              </div>
            </div>
          )}
        </div>

        {/* Área de Entrada */}
        <div className="shrink-0 border-t border-line bg-surface p-4">
          {/* Sugestões (Perguntas Rápidas) */}
          {messages.length <= 1 && !selectedImage && (
            <div className="mb-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleSend(sug)}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1.5 text-xs font-medium text-ink/70 transition-all hover:border-primary/40 hover:text-ink active:scale-95"
                >
                  <IconSparkles width={12} height={12} className="text-accent" />
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Preview da Imagem Selecionada */}
          {selectedImage && (
            <div className="mb-3 relative inline-block">
              <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-bg">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="h-24 w-24 object-cover opacity-90"
                />
                <button 
                  onClick={removeImage}
                  className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink/80 text-bg backdrop-blur-sm transition-transform hover:scale-110"
                >
                  <IconX width={14} height={14} />
                </button>
              </div>
            </div>
          )}

          {/* Input e Enviar */}
          <div className="flex items-end gap-2 relative">
            <label
              className="inline-flex h-11 cursor-pointer shrink-0 items-center justify-center rounded-xl border border-line bg-surface px-3 text-sm font-medium text-ink/70 transition-all duration-200 hover:border-primary/40 hover:bg-primary-soft/50 hover:text-ink focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-bg"
              title="Anexar imagem"
            >
              <input 
                type="file" 
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
              <IconImage width={20} height={20} />
            </label>
            
            {/* O `flex-1` precisa ficar no wrapper do Input: a className do
                componente vai para o <input>, que já é `w-full` */}
            <div className="min-w-0 flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedImage ? "Adicione um comentário sobre a imagem..." : "Pergunte algo ou anexe uma imagem..."}
                className="rounded-2xl bg-bg"
              />
            </div>
            
            <Button
              size="md"
              onClick={() => handleSend(input)}
              disabled={(!input.trim() && !selectedImage) || isTyping}
              className="shrink-0 rounded-xl"
            >
              <IconSend width={18} height={18} />
              <span className="sr-only sm:not-sr-only sm:ml-1">Enviar</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
