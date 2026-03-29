import { useState } from "react";
import { Link } from "wouter";
import {
  CheckSquare, Users, FileText, Shield, Bot, Calendar, Bell, BarChart3,
  ArrowRight, Star, Check, ChevronDown, MessageSquare, Zap, Clock,
  TrendingUp, Lock, Database, Globe, Phone, Mail, MapPin, Menu, X,
  IndianRupee, Award, Building2
} from "lucide-react";
import { toast } from "sonner";

const features = [
  { icon: CheckSquare, title: "Smart Task Management", desc: "Auto-create recurring tasks for GSTR, ITR, TDS. Assign to staff, track progress in real-time.", color: "bg-blue-50 text-blue-600" },
  { icon: Calendar, title: "Compliance Calendar", desc: "Never miss a deadline. GST, ITR, TDS, ROC dates with smart alerts 15 days in advance.", color: "bg-indigo-50 text-indigo-600" },
  { icon: Users, title: "Client Management", desc: "Centralized client database with PAN, GSTIN, documents. Client login portal with OTP.", color: "bg-cyan-50 text-cyan-600" },
  { icon: FileText, title: "Billing & Invoicing", desc: "GST invoices with multi-entity support. Auto payment reminders via WhatsApp & SMS.", color: "bg-blue-50 text-blue-700" },
  { icon: Bot, title: "AI Tax Assistant", desc: "Instant answers on GST rules, ITR sections, TDS rates. Available 24/7 on WhatsApp & Telegram.", color: "bg-purple-50 text-purple-600" },
  { icon: Shield, title: "DSC Management", desc: "Track expiry dates, token numbers. Get alerts before your client DSCs expire.", color: "bg-green-50 text-green-600" },
  { icon: MessageSquare, title: "WhatsApp & Telegram", desc: "Send bulk reminders, invoices, task updates via WhatsApp API and Telegram bot.", color: "bg-teal-50 text-teal-600" },
  { icon: BarChart3, title: "Advanced Reports", desc: "Revenue reports, task completion rates, client analytics, outstanding payments — all in one.", color: "bg-orange-50 text-orange-600" },
  { icon: Lock, title: "Bank-Grade Security", desc: "AWS hosted, 2FA login, encrypted data, role-based access, regular security audits.", color: "bg-red-50 text-red-600" },
];

const testimonials = [
  { name: "CA Rajesh Sharma", firm: "Sharma & Associates, Delhi", text: "SmartCompliance changed how we run our office. Never miss a compliance deadline now. The AI assistant is brilliant!", rating: 5 },
  { name: "CA Priya Mehta", firm: "PM Tax Consultants, Mumbai", text: "The WhatsApp integration alone saved us 3 hours daily. Clients love getting automated reminders. Highly recommended!", rating: 5 },
  { name: "CA Vivek Agrawal", firm: "Agrawal & Co, Pune", text: "Best investment for our CA firm. The compliance calendar and DSC tracker are game-changers. Excellent support team.", rating: 5 },
  { name: "CA Suresh Gupta", firm: "Gupta Tax Services, Ahmedabad", text: "We managed 200+ clients without any chaos. Task automation saved us enormous time during ITR season.", rating: 5 },
  { name: "CA Anjali Singh", firm: "Singh & Partners, Bangalore", text: "Migrated from multiple Excel sheets to SmartCompliance. The billing module is outstanding and saves hours.", rating: 5 },
  { name: "CA Mohammed Rafi", firm: "Rafi Associates, Hyderabad", text: "The AI Tax Assistant helps my team get quick answers on GST queries. Clients are happier and we work smarter.", rating: 5 },
];

const faqs = [
  { q: "Is SmartCompliance built specifically for Indian CA firms?", a: "Yes! SmartCompliance is 100% built for India — with GST, ITR, TDS, ROC compliance calendars, ₹ billing, and WhatsApp/Telegram integration for the Indian market." },
  { q: "How does the AI Tax Assistant work?", a: "Our AI assistant is trained on Indian tax laws — GST Act, Income Tax Act, TDS provisions. It answers queries instantly on WhatsApp, Telegram, or the web portal. Available 24/7." },
  { q: "Can I integrate WhatsApp and Telegram?", a: "Yes! Connect your WhatsApp Business API or Telegram bot to send automated reminders, invoices, task updates, and payment links to clients." },
  { q: "Is my client data secure?", a: "Absolutely. We use AWS India servers, 256-bit encryption, 2FA login, role-based access control, and conduct regular security audits." },
  { q: "Can I import my existing client data?", a: "Yes, import clients in bulk using Excel/CSV. All your PAN, GSTIN, contact details migrate in minutes." },
  { q: "Is there a mobile app?", a: "Yes, our progressive web app works on all mobile devices. A native Android/iOS app is coming soon." },
];

export default function Landing() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [users, setUsers] = useState(5);
  const [form, setForm] = useState({ name: "", email: "", phone: "", firmName: "", teamSize: "5" });
  const [submitting, setSubmitting] = useState(false);

  const pricePerUser = users <= 5 ? 99 : users <= 10 ? 91 : users <= 30 ? 83 : 75;
  const annualCost = users * pricePerUser * 12;

  const handleDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, teamSize: String(users) }),
      });
      if (res.ok) {
        toast.success("Demo booked! We'll contact you within 24 hours.");
        setForm({ name: "", email: "", phone: "", firmName: "", teamSize: "5" });
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Smart<span className="text-blue-600">Compliance</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Reviews</a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600 px-3 py-2">Login</Link>
            <Link href="/login" className="btn-blue text-sm font-semibold px-5 py-2 rounded-lg">
              Get Started Free
            </Link>
          </div>

          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2">
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-gray-600 py-2">Features</a>
            <a href="#pricing" className="block text-sm text-gray-600 py-2">Pricing</a>
            <a href="#testimonials" className="block text-sm text-gray-600 py-2">Reviews</a>
            <Link href="/login" className="block btn-blue text-center text-sm font-semibold px-5 py-2.5 rounded-lg mt-2">
              Get Started Free
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 text-blue-200 text-sm mb-6">
              <Award className="w-4 h-4" />
              #1 Compliance Software for Indian CA Firms
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Automate Smarter.<br />
              <span className="text-blue-400">Work Faster.</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              All-in-one practice management for CAs — tasks, clients, GST/ITR compliance, billing, DSC tracking, and AI-powered WhatsApp & Telegram integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn-blue inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg">
                Open Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#demo" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all">
                Book Free Demo
              </a>
            </div>
            <p className="text-blue-300 text-sm mt-6">No setup cost. No hidden charges. Free 14-day trial.</p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent pointer-events-none" />
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 max-w-5xl mx-auto">
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="flex gap-1.5 p-3 bg-gray-800">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-400 text-xs ml-3">SmartCompliance Dashboard</span>
                </div>
                <div className="p-4 grid grid-cols-4 gap-3">
                  {[
                    { label: "Total Clients", value: "247", change: "+12 this month", color: "bg-blue-500" },
                    { label: "Pending Tasks", value: "38", change: "Due this week", color: "bg-yellow-500" },
                    { label: "Revenue (₹)", value: "2.4L", change: "+18% vs last month", color: "bg-green-500" },
                    { label: "Compliance", value: "7", change: "Deadlines in 30 days", color: "bg-purple-500" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg p-3">
                      <div className={`w-2 h-2 rounded-full ${stat.color} mb-2`} />
                      <div className="text-white text-xl font-bold">{stat.value}</div>
                      <div className="text-gray-400 text-xs">{stat.label}</div>
                      <div className="text-gray-500 text-xs mt-1">{stat.change}</div>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-4 grid grid-cols-3 gap-3">
                  {["GSTR-3B — Aug 20 (12 days)", "ITR Filing — Jul 31 (Overdue)", "TDS Q1 — Jul 31 (Overdue)"].map((item, i) => (
                    <div key={i} className={`rounded-lg p-3 ${i === 0 ? "bg-blue-900/40 border border-blue-700/50" : "bg-red-900/30 border border-red-700/30"}`}>
                      <div className={`text-xs font-medium ${i === 0 ? "text-blue-300" : "text-red-300"}`}>{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2,000+", label: "CA Firms" },
              { value: "4.8★", label: "Average Rating" },
              { value: "15L+", label: "Tax Files Handled" },
              { value: "99.9%", label: "Uptime SLA" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3">Everything You Need</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Smarter CA Work</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">From task automation to AI-powered compliance tracking — one platform for your entire practice.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card-hover border border-gray-100 rounded-2xl p-6 hover:shadow-lg">
                  <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance Calendar Highlight */}
      <section className="py-24 px-4" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3">Smart Compliance Tracker</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Never Miss a Deadline Again</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Our AI-powered compliance calendar tracks all GST, ITR, TDS, ROC, and MCA deadlines automatically. Get smart alerts 15 days before due dates.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Bell, text: "Smart alerts 15 days before due date" },
                  { icon: Zap, text: "Auto-create tasks for upcoming filings" },
                  { icon: MessageSquare, text: "Notify clients via WhatsApp & Telegram" },
                  { icon: TrendingUp, text: "Track compliance score for each client" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{item.text}</span>
                    </div>
                  );
                })}
              </div>
              <Link href="/dashboard/compliance" className="inline-flex items-center gap-2 btn-blue px-6 py-3 rounded-xl font-semibold mt-8">
                View Compliance Calendar <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Upcoming Compliance</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">August 2025</span>
              </div>
              {[
                { title: "GSTR-1 Filing", date: "Aug 11", category: "GST", days: 3, color: "bg-red-100 text-red-700" },
                { title: "GSTR-3B Filing", date: "Aug 20", category: "GST", days: 12, color: "bg-yellow-100 text-yellow-700" },
                { title: "TDS Deposit", date: "Aug 7", category: "TDS", days: 1, color: "bg-red-100 text-red-700" },
                { title: "Advance Tax 2nd", date: "Sep 15", category: "ITR", days: 38, color: "bg-green-100 text-green-700" },
                { title: "ROC Annual Filing", date: "Nov 30", category: "ROC", days: 84, color: "bg-blue-100 text-blue-700" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${item.color}`}>{item.category}</span>
                    <span className="text-sm font-medium text-gray-800">{item.title}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{item.date}</p>
                    <p className={`text-xs ${item.days <= 7 ? "text-red-500" : "text-gray-500"}`}>{item.days}d left</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI & Integrations */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3">AI & Integrations</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Connect Everything You Use</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">WhatsApp, Telegram, AI assistant — all built in so you never switch apps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: "AI Tax Assistant",
                desc: "Ask anything about GST, ITR, TDS, Companies Act. Get instant, accurate answers based on current Indian tax laws.",
                color: "from-purple-500 to-blue-600",
                features: ["GST Query Resolution", "ITR Section Guidance", "TDS Rate Calculator", "Penalty Estimator"],
              },
              {
                icon: MessageSquare,
                title: "WhatsApp Integration",
                desc: "Send invoices, payment reminders, task updates directly to client WhatsApp. Automated bulk messaging.",
                color: "from-green-500 to-teal-600",
                features: ["Bulk Messaging", "Payment Reminders", "Invoice Delivery", "Read Receipts"],
              },
              {
                icon: Bell,
                title: "Telegram Bot",
                desc: "Get instant compliance alerts on Telegram. Staff can update task status, clients get notifications.",
                color: "from-blue-500 to-cyan-600",
                features: ["Compliance Alerts", "Task Updates", "Client Notifications", "Daily Summary"],
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden card-hover">
                  <div className={`h-2 bg-gradient-to-r ${item.color}`} />
                  <div className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
                    <ul className="space-y-2">
                      {item.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-500" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3">Pricing</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-500 text-lg">Less than your daily chai. No setup cost, no hidden charges.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-4 text-lg">Choose number of users:</p>
              <input type="range" min="1" max="100" value={users} onChange={(e) => setUsers(Number(e.target.value))}
                className="w-full max-w-md accent-blue-600" />
              <p className="text-5xl font-bold text-blue-600 mt-4">{users} <span className="text-2xl text-gray-500">users</span></p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { range: "Up to 5", price: 99, active: users <= 5 },
                { range: "6–10 users", price: 91, active: users > 5 && users <= 10 },
                { range: "11–30 users", price: 83, active: users > 10 && users <= 30 },
              ].map((tier, i) => (
                <div key={i} className={`rounded-xl p-4 text-center border-2 transition-all ${tier.active ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                  <p className="text-sm text-gray-600 mb-1">{tier.range}</p>
                  <p className="text-2xl font-bold text-gray-900">₹{tier.price}<span className="text-sm text-gray-500">/user/mo</span></p>
                </div>
              ))}
            </div>

            <div className="text-center bg-blue-50 rounded-xl p-6 mb-8">
              <p className="text-gray-600 mb-1">Annual Cost (excl. GST)</p>
              <p className="text-4xl font-bold text-blue-600">₹{annualCost.toLocaleString("en-IN")}</p>
              <p className="text-gray-500 text-sm mt-1">₹{pricePerUser}/user/month × {users} users × 12 months</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {["Unlimited Storage", "Client Portal", "WhatsApp API", "AI Assistant",
                "Compliance Calendar", "DSC Management", "All Reports", "Mobile App"].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />{f}
                </div>
              ))}
            </div>

            <div className="text-center">
              <a href="#demo" className="btn-blue inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-lg">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-gray-400 text-sm mt-3">14-day free trial • No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3">Reviews</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by 2,000+ CA Firms</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card-hover border border-gray-100 rounded-2xl p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    {t.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.firm}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Form */}
      <section id="demo" className="py-24 px-4" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Book a Free Demo</h2>
          <p className="text-blue-200 text-lg mb-10">See SmartCompliance in action. Get a personalized walkthrough for your firm.</p>
          <form onSubmit={handleDemo} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 text-left">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-blue-200 text-sm mb-1 block">Full Name *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="CA Rajesh Sharma" />
              </div>
              <div>
                <label className="text-blue-200 text-sm mb-1 block">Phone *</label>
                <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="text-blue-200 text-sm mb-1 block">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="ca@example.com" />
              </div>
              <div>
                <label className="text-blue-200 text-sm mb-1 block">Firm Name</label>
                <input value={form.firmName} onChange={e => setForm({...form, firmName: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Sharma & Associates" />
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full btn-blue mt-6 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2">
              {submitting ? "Booking..." : <><span>Book Free Demo</span> <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white text-lg">Smart<span className="text-blue-400">Compliance</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Office management software for Chartered Accountants and accounting firms across India.</p>
              <div className="flex gap-3 mt-4">
                {["W", "T", "IN", "YT"].map((s, i) => (
                  <div key={i} className="w-8 h-8 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center text-gray-300 text-xs cursor-pointer transition-colors">{s}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-blue-400">Features</a></li>
                <li><a href="#pricing" className="hover:text-blue-400">Pricing</a></li>
                <li><Link href="/login" className="hover:text-blue-400">Dashboard</Link></li>
                <li><Link href="/dashboard/ai" className="hover:text-blue-400">AI Assistant</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#faq" className="hover:text-blue-400">FAQ</a></li>
                <li><a href="#demo" className="hover:text-blue-400">Book Demo</a></li>
                <li><a href="mailto:contact@smartcompliance.in" className="hover:text-blue-400">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
              <div className="space-y-3 text-gray-400 text-sm">
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400" />+91 90245 70899</div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" />contact@smartcompliance.in</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" />India</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">©2025 SmartCompliance. All rights reserved. Made in India 🇮🇳</p>
            <div className="flex gap-6 text-gray-500 text-sm">
              <a href="#" className="hover:text-blue-400">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400">Terms of Use</a>
              <a href="#" className="hover:text-blue-400">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
