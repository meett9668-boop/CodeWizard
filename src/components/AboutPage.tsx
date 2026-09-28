import React from 'react';
import { Target, Compass, Zap, Cpu, Award, Terminal, CheckCircle } from 'lucide-react';
import { Card, Badge } from './ui';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <Badge variant="amber">About the Club</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
          Pioneering the Next Era of <span className="text-[var(--coral)]">Student Builders</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          GIT Club is a student-operated technical community dedicated to open source craft, hardware experiments, and collaborative software engineering.
        </p>
      </div>

      {/* Editorial Section 1: Who We Are */}
      <Card tone="lavender" className="p-8 sm:p-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-xl border border-[var(--ink)] text-[var(--ink)]">
            <Terminal className="w-5 h-5 text-[var(--coral)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--ink)]">Who We Are</h2>
        </div>
        <p className="text-sm text-[var(--ink)]/85 leading-relaxed">
          Founded as an independent student collective, GIT Club bridges the gap between classroom computer science and production software shipping. Our members build distributed cloud infrastructure, train ML models, participate in 24-hr hackathons, and design high-impact campus tooling.
        </p>
      </Card>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card tone="yellow" className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[var(--ink)] text-[var(--ink)] flex items-center justify-center">
            <Target className="w-5 h-5 text-[var(--coral)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--ink)]">Our Mission</h3>
          <p className="text-xs sm:text-sm text-[var(--ink)]/85 leading-relaxed">
            To provide an open environment where every student can cultivate production-grade coding skills, ship real projects, and lead cross-functional teams.
          </p>
        </Card>

        <Card tone="sky" className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[var(--ink)] text-[var(--ink)] flex items-center justify-center">
            <Compass className="w-5 h-5 text-[var(--coral)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--ink)]">Our Vision</h3>
          <p className="text-xs sm:text-sm text-[var(--ink)]/85 leading-relaxed">
            To evolve into a premier campus developer hub known for high-caliber engineers, open-source contributions, and hackathon championships.
          </p>
        </Card>
      </div>

      {/* Areas of Technical Focus */}
      <div className="space-y-6">
        <div>
          <Badge variant="indigo">Wings</Badge>
          <h2 className="text-2xl font-bold text-[var(--ink)] mt-2">Technical Focus Wings</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Systems & Cloud Infrastructure', desc: 'Kubernetes, Rust, DevOps pipelines, microservices, and distributed architecture.', icon: Cpu },
            { name: 'AI & Data Intelligence', desc: 'Large language models, vision transformers, MLOps, and algorithmic data pipelines.', icon: Zap },
            { name: 'Full Stack Engineering', desc: 'Modern web apps, React/TypeScript architecture, GraphQL, and edge computing.', icon: Terminal },
            { name: 'Cybersecurity & CTF', desc: 'Capture-the-flag competitions, cryptographic protocols, and secure code audits.', icon: Target },
            { name: 'IoT & Embedded Robotics', desc: 'ESP32 microcontrollers, ROS2 robotics, and wireless telemetry sensors.', icon: Compass },
            { name: 'UI/UX & Product Design', desc: 'Design systems, accessibility standards, user research, and interactive prototypes.', icon: Award },
          ].map((wing, i) => (
            <Card key={i} className="p-5 space-y-2">
              <wing.icon className="w-5 h-5 text-[var(--coral)]" />
              <h4 className="text-base font-bold text-[var(--ink)]">{wing.name}</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{wing.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Join */}
      <Card className="p-8 space-y-4">
        <h2 className="text-xl font-bold text-[var(--ink)]">Why Join GIT Club?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            'Access to GPU workstations and cloud sandbox credits',
            'Travel grants and registration sponsorship for hackathons',
            'Direct mentorship from alumni engineers working at top tech firms',
            'Structured leadership succession and project ownership',
            'Hands-on bootcamps and verifiable certificates of completion',
            'Collaborative open-source culture with active peer code reviews'
          ].map((point, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[var(--text-main)]">
              <CheckCircle className="w-4 h-4 text-[var(--accent-emerald)] shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
