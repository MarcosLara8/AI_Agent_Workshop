"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts: Particle[] = Array.from({ length: 75 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p, i) => {
        pts.slice(i + 1).forEach((q) => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        });
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.opacity})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.7 }} />;
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let v = 0;
      const step = to / 60;
      const t = setInterval(() => { v += step; if (v >= to) { setN(to); clearInterval(t); } else setN(Math.floor(v)); }, 25);
      obs.disconnect();
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

const features = [
  { icon: "🧠", title: "LLM Integration",     desc: "Connect to frontier models via Groq and xAI APIs with a single unified interface.",                          grad: "from-indigo-500 to-purple-600" },
  { icon: "🔍", title: "Search Agents",        desc: "Build autonomous agents that research, reason, and retrieve information from the web in real time.",           grad: "from-purple-500 to-pink-600"   },
  { icon: "⚡", title: "Rapid Prototyping",    desc: "From zero to a working AI agent in minutes using smolagents and Streamlit — no complex setup needed.",         grad: "from-pink-500 to-red-500"      },
  { icon: "🛠️", title: "Hands-On Coding",      desc: "Every concept is immediately applied in a working Colab notebook — follow along and build as you learn.",       grad: "from-cyan-500 to-blue-600"     },
  { icon: "🚀", title: "Cloud Deployment",     desc: "Run your agent in GitHub Codespaces and expose it publicly with zero local setup required.",                    grad: "from-blue-500 to-indigo-600"   },
  { icon: "🔒", title: "Secure by Design",     desc: "Learn best practices for API key management, environment variables, and safe agent deployment.",                grad: "from-emerald-500 to-teal-600"  },
];

const stack = [
  { icon: "𝕏",  name: "xAI Grok2",          role: "LLM Backend",         color: "border-indigo-500", bg: "bg-indigo-500/10", desc: "Free-tier frontier model"       },
  { icon: "⚡", name: "Groq",               role: "Ultra-fast Inference", color: "border-purple-500", bg: "bg-purple-500/10", desc: "Blazing-fast LLM inference"     },
  { icon: "🤗", name: "smolagents",         role: "Agent Framework",      color: "border-pink-500",   bg: "bg-pink-500/10",   desc: "HuggingFace agent library"      },
  { icon: "🌊", name: "Streamlit",          role: "Web Interface",        color: "border-cyan-500",   bg: "bg-cyan-500/10",   desc: "Fast Python web apps"           },
  { icon: "☁️", name: "GitHub Codespaces",  role: "Cloud IDE",            color: "border-blue-500",   bg: "bg-blue-500/10",   desc: "Zero-setup cloud dev env"       },
  { icon: "🐍", name: "Python",             role: "Core Language",        color: "border-yellow-500", bg: "bg-yellow-500/10", desc: "The language of AI"             },
];

const steps = [
  { num: "01", title: "Fork the Repository", desc: "Hit Fork on GitHub to get your own copy of the workshop codebase.",                          action: "Fork on GitHub", link: "https://github.com/marscod/AI_Agent_Workshop" },
  { num: "02", title: "Get an API Key",       desc: "Sign up for a free xAI Grok2 or Groq key and drop it into your .env file.",                  action: "Get xAI Key",    link: "https://docs.x.ai/docs/overview"             },
  { num: "03", title: "Open in Codespaces",   desc: "Replace github.com with github.dev in the URL — your cloud IDE opens instantly.",            action: null, link: null },
  { num: "04", title: "Run the Agent",        desc: "Execute setup.sh then run.sh and your AI search agent is live in seconds.",                   action: null, link: null },
];

const stats = [
  { to: 100, suffix: "%",    label: "Free to use"    },
  { to: 5,   suffix: " min", label: "To first agent" },
  { to: 3,   suffix: "+",    label: "LLM providers"  },
  { to: 0,   suffix: "",     label: "Local setup"    },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background:    scrollY > 50 ? "rgba(3,7,18,0.92)" : "transparent",
          backdropFilter:scrollY > 50 ? "blur(16px)" : "none",
          borderBottom:  scrollY > 50 ? "1px solid rgba(99,102,241,0.2)" : "none",
        }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">AI</div>
            <span className="font-semibold text-white">Agent Workshop</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#stack"    className="hover:text-white transition-colors">Stack</a>
            <a href="#setup"    className="hover:text-white transition-colors">Setup</a>
            <a href="https://github.com/marscod/AI_Agent_Workshop" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium">
              GitHub →
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
        <ParticleCanvas />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            Hands-on AI Workshop — Open to Everyone
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight">
            <span className="text-white">Build Your First</span><br />
            <span className="shimmer-text">AI Agent</span><br />
            <span className="text-white">in Minutes</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A hands-on workshop where you create a real, production-ready AI search agent
            powered by frontier LLMs — no ML degree required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="https://github.com/marscod/AI_Agent_Workshop" target="_blank" rel="noopener noreferrer"
              className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 animate-pulse-glow">
              Start Building
              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
            </a>
            <a href="https://gist.github.com/marscod/9e1cd2dfd07d8448d52214a63851a394" target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white rounded-xl font-semibold text-lg transition-all duration-300">
              Open Colab Notebook
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="text-3xl font-black text-indigo-400">
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-sm">
          <span>scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-indigo-500 to-transparent animate-float" />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 px-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-3">What You&apos;ll Learn</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Everything to build a<br /><span className="shimmer-text">production AI agent</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              No fluff — just the core skills to ship working AI applications that real users can interact with.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-glow relative p-6 rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm overflow-hidden group">
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${f.grad} opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section id="stack" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-purple-400 font-mono text-sm uppercase tracking-widest mb-3">Technology Stack</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Built on <span className="shimmer-text">cutting-edge tools</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stack.map((t) => (
              <div key={t.name} className={`card-glow p-6 rounded-2xl border ${t.color} ${t.bg} flex items-start gap-4`}>
                <div className="text-3xl flex-shrink-0">{t.icon}</div>
                <div>
                  <div className="font-bold text-white text-lg">{t.name}</div>
                  <div className="text-xs font-mono text-gray-500 mb-1">{t.role}</div>
                  <div className="text-sm text-gray-400">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CODE PREVIEW */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-4 text-xs text-gray-600 font-mono">websearchagent.py</span>
            </div>
            <pre className="p-6 text-sm font-mono overflow-x-auto text-gray-300 leading-7">
              <code>
                <span className="text-purple-400">from</span>{" "}
                <span className="text-cyan-400">smolagents</span>{" "}
                <span className="text-purple-400">import</span>{" "}
                <span className="text-white">CodeAgent, LiteLLMModel, DuckDuckGoSearchTool</span>{"\n\n"}
                <span className="text-gray-500"># 🔧 Pick your LLM provider</span>{"\n"}
                <span className="text-white">model </span>
                <span className="text-pink-400">=</span>{" "}
                <span className="text-cyan-400">LiteLLMModel</span>
                <span className="text-white">(model_id=</span>
                <span className="text-green-400">&quot;xai/grok-2-latest&quot;</span>
                <span className="text-white">)</span>{"\n\n"}
                <span className="text-gray-500"># 🤖 Create an agent with search capabilities</span>{"\n"}
                <span className="text-white">agent </span>
                <span className="text-pink-400">=</span>{" "}
                <span className="text-cyan-400">CodeAgent</span>
                <span className="text-white">(</span>{"\n"}
                {"    "}<span className="text-white">tools</span><span className="text-pink-400">=</span>
                <span className="text-white">[</span><span className="text-cyan-400">DuckDuckGoSearchTool</span><span className="text-white">()],</span>{"\n"}
                {"    "}<span className="text-white">model</span><span className="text-pink-400">=</span><span className="text-white">model,</span>{"\n"}
                <span className="text-white">)</span>{"\n\n"}
                <span className="text-gray-500"># 🚀 Run it!</span>{"\n"}
                <span className="text-white">result </span>
                <span className="text-pink-400">=</span>{" "}
                <span className="text-white">agent.run(</span>
                <span className="text-green-400">&quot;What are the latest AI breakthroughs?&quot;</span>
                <span className="text-white">)</span>
              </code>
            </pre>
          </div>
          <p className="text-center text-gray-600 text-sm mt-4 font-mono">
            That&apos;s it. A fully functional AI search agent in ~10 lines.
          </p>
        </div>
      </section>

      {/* SETUP */}
      <section id="setup" className="py-32 px-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(56,189,248,0.05) 0%, transparent 70%)" }} />
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest mb-3">Quick Start</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Up and running in <span className="shimmer-text">4 steps</span>
            </h2>
          </div>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative flex gap-6 p-6 rounded-2xl border border-gray-800 bg-gray-900/50 card-glow">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <span className="font-black text-indigo-400 font-mono text-lg">{step.num}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{step.desc}</p>
                  {step.action && step.link && (
                    <a href={step.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                      {step.action} →
                    </a>
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute left-[2.75rem] -bottom-6 w-px h-6 bg-gradient-to-b from-indigo-500/40 to-transparent" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl border border-gray-800 bg-gray-900/80">
            <p className="text-gray-500 text-sm font-mono mb-4"># Once in Codespaces, run:</p>
            <div className="space-y-2">
              {["./setup.sh", "source venv/bin/activate", "./run.sh"].map((cmd) => (
                <div key={cmd} className="flex items-center gap-3 p-3 rounded-lg bg-gray-950 border border-gray-800">
                  <span className="text-indigo-500 font-mono text-sm">$</span>
                  <code className="text-green-400 font-mono text-sm">{cmd}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4">Ready to build?</p>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Your AI agent is<br /><span className="shimmer-text">one fork away</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
            Join workshops worldwide, contribute to the open-source project,
            or run the session at your own university or meetup.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://github.com/marscod/AI_Agent_Workshop" target="_blank" rel="noopener noreferrer"
              className="group px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all duration-300 animate-pulse-glow">
              Fork the Repo
              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
            </a>
            <a href="https://gist.github.com/marscod/9e1cd2dfd07d8448d52214a63851a394" target="_blank" rel="noopener noreferrer"
              className="px-10 py-5 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white rounded-xl font-bold text-lg transition-all duration-300">
              Open Colab
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-xs font-bold">AI</div>
            <span className="text-gray-500 text-sm">AI Agent Workshop</span>
          </div>
          <div className="text-gray-700 text-sm font-mono">Open source · MIT License · Contributions welcome</div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="https://github.com/marscod/AI_Agent_Workshop" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">GitHub</a>
            <a href="https://docs.x.ai/docs/overview"              target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">xAI Docs</a>
            <a href="https://gist.github.com/marscod/9e1cd2dfd07d8448d52214a63851a394" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Colab</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
