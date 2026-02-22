"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Sun,
  Menu,
  X,
  Key,
  Monitor,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Check,
  Users,
  Award,
  Zap,
  Shield,
  ChevronDown,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUp,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "تم إرسال طلبك بنجاح!",
          description: "سنتواصل معك في أقرب وقت ممكن",
        });
        setFormData({ name: "", phone: "", service: "", message: "" });
      } else {
        throw new Error("حدث خطأ في الإرسال");
      }
    } catch {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال طلبك، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { href: "#home", label: "الرئيسية" },
    { href: "#services", label: "الخدمات" },
    { href: "#pricing", label: "الأسعار" },
    { href: "#testimonials", label: "آراء العملاء" },
    { href: "#about", label: "من نحن" },
    { href: "#contact", label: "تواصل معنا" },
  ];

  const services = [
    {
      icon: Key,
      title: "خدمات السريال",
      description: "نوفر تراخيص برمجيات أصلية وسريالات فعالة لجميع البرامج والتطبيقات. نضمن لك الحصول على تراخيص قانونية وآمنة.",
      features: ["تراخيص أصلية 100%", "دعم فني متواصل", "تحديثات مجانية", "ضمان استرداد"],
    },
    {
      icon: Monitor,
      title: "التحكم عن بعد",
      description: "خدمات TeamViewer احترافية لحل مشاكلك التقنية عن بُعد. فريقنا متخصص في تقديم الدعم الفني السريع والفعال.",
      features: ["دعم فوري 24/7", "حلول سريعة", "أمان عالي", "تكلفة منخفضة"],
    },
  ];

  const pricingPlans = [
    {
      name: "الباقة الأساسية",
      price: "99",
      period: "شهرياً",
      description: "مثالية للأفراد والمشاريع الصغيرة",
      features: [
        "سريال واحد",
        "دعم فني عبر البريد",
        "تحديثات شهرية",
        "ضمان 30 يوم",
      ],
      popular: false,
    },
    {
      name: "الباقة الاحترافية",
      price: "249",
      period: "شهرياً",
      description: "الأكثر شعبية للشركات المتوسطة",
      features: [
        "5 سريالات",
        "دعم فني على مدار الساعة",
        "تحديثات فورية",
        "ضمان 90 يوم",
        "خدمة التحكم عن بعد",
        "أولوية في الدعم",
      ],
      popular: true,
    },
    {
      name: "باقة المؤسسات",
      price: "499",
      period: "شهرياً",
      description: "حلول متكاملة للشركات الكبيرة",
      features: [
        "سريالات غير محدودة",
        "فريق دعم مخصص",
        "تحديثات تلقائية",
        "ضمان سنة كاملة",
        "خدمة التحكم عن بعد",
        "تدريب الفريق",
        "تقارير شهرية",
      ],
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مدير شركة تقنية",
      content: "خدمة ممتازة وسريعة! حصلت على الترخيص في دقائق معدودة. فريق الدعم متعاون جداً ومحترف.",
      rating: 5,
      avatar: "أ",
    },
    {
      name: "سارة العلي",
      role: "مصممة مستقلة",
      content: "أفضل خدمة سريال تعاملت معها. الأسعار معقولة والجودة عالية. أنصح بها بشدة!",
      rating: 5,
      avatar: "س",
    },
    {
      name: "خالد السعيد",
      role: "مطور برمجيات",
      content: "خدمة التحكم عن بعد ساعدتني في حل مشاكل تقنية معقدة بسرعة. شكراً لفريق Sun Software!",
      rating: 5,
      avatar: "خ",
    },
    {
      name: "نورة الفهد",
      role: "صاحبة متجر إلكتروني",
      content: "تجربة رائعة من البداية للنهاية. الدعم الفني متميز والأسعار تنافسية.",
      rating: 5,
      avatar: "ن",
    },
  ];

  const stats = [
    { icon: Users, value: "5000+", label: "عميل سعيد" },
    { icon: Award, value: "10+", label: "سنوات خبرة" },
    { icon: Zap, value: "24/7", label: "دعم فني" },
    { icon: Shield, value: "100%", label: "ضمان الجودة" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-3">
              <Image
                src="/sun-software-logo.png"
                alt="Sun Software Logo"
                width={45}
                height={45}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-gradient-sun">Sun Software</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button className="gradient-sun text-sun-darker font-semibold hover:opacity-90 transition-opacity">
                <a href="#contact">احجز موعد</a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-border">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <Button className="gradient-sun text-sun-darker font-semibold mt-2">
                  <a href="#contact">احجز موعد</a>
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-dark"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated Sun Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Sun className="w-24 h-24 text-primary animate-float" />
                <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full"></div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-gradient-sun">Sun Software</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              شريكك التقني الموثوق
            </p>
            
            {/* Description */}
            <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl mx-auto">
              نقدم خدمات برمجية احترافية تشمل تراخيص السريال وخدمات التحكم عن بعد
              <br />
              حلول تقنية مبتكرة تلبي احتياجاتك
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-sun text-sun-darker font-semibold text-lg px-8 hover-lift">
                <a href="#services">استكشف خدماتنا</a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-sun-darker font-semibold text-lg px-8 hover-lift">
                <a href="#contact">تواصل معنا</a>
              </Button>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-gradient-sun mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 gradient-sun text-sun-darker">خدماتنا</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              خدمات <span className="text-gradient-sun">احترافية</span> متنوعة
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              نقدم مجموعة متكاملة من الخدمات البرمجية لتلبية جميع احتياجاتك التقنية
            </p>
          </div>

          {/* Services Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="gradient-card border-border hover-lift group">
                <CardHeader>
                  <div className="w-16 h-16 gradient-sun rounded-2xl flex items-center justify-center mb-4 group-hover:animate-pulse-glow">
                    <service.icon className="w-8 h-8 text-sun-darker" />
                  </div>
                  <CardTitle className="text-2xl text-gradient-sun">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-6 h-6 gradient-sun rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-sun-darker" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 gradient-sun text-sun-darker">الأسعار</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              باقات <span className="text-gradient-sun">مناسبة</span> للجميع
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              اختر الباقة التي تناسب احتياجاتك وميزانيتك
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative gradient-card border-border hover-lift ${
                  plan.popular ? "ring-2 ring-primary scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="gradient-sun text-sun-darker font-semibold px-4">
                      الأكثر شعبية
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-gradient-sun">{plan.price}</span>
                    <span className="text-muted-foreground mr-2">ر.س / {plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full font-semibold ${
                      plan.popular
                        ? "gradient-sun text-sun-darker"
                        : "border-primary text-primary hover:bg-primary hover:text-sun-darker"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <a href="#contact">اختر الباقة</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 gradient-sun text-sun-darker">آراء العملاء</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              ماذا يقول <span className="text-gradient-sun">عملاؤنا</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              نفتخر بثقة عملائنا وآرائهم الإيجابية في خدماتنا
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="gradient-card border-border hover-lift">
                <CardContent className="pt-6">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 gradient-sun rounded-full flex items-center justify-center">
                      <span className="text-sun-darker font-bold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* About Section */}
      <section id="about" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Content */}
            <div>
              <Badge className="mb-4 gradient-sun text-sun-darker">من نحن</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                شريكك التقني <span className="text-gradient-sun">الموثوق</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                <strong className="text-foreground">Sun Software</strong> هي شركة رائدة في تقديم الخدمات البرمجية
                عن بعد. نعمل منذ أكثر من 10 سنوات على تقديم حلول تقنية مبتكرة وموثوقة لعملائنا في جميع
                أنحاء العالم.
              </p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                نتميز بفريق من المحترفين المتخصصين في مجالات البرمجة والدعم الفني، ونلتزم بتقديم
                أعلى مستويات الجودة والخدمة لضمان رضا عملائنا.
              </p>
              
              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Shield, text: "أمان وخصوصية تامة" },
                  { icon: Clock, text: "دعم فني متواصل" },
                  { icon: Award, text: "جودة مضمونة" },
                  { icon: Users, text: "فريق محترف" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 gradient-sun rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-sun-darker" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image/Visual */}
            <div className="relative">
              <div className="aspect-square rounded-3xl gradient-card border border-border p-8 flex items-center justify-center">
                <div className="text-center">
                  <Image
                    src="/sun-software-logo.png"
                    alt="Sun Software"
                    width={200}
                    height={200}
                    className="mx-auto mb-6 animate-float"
                  />
                  <div className="text-2xl font-bold text-gradient-sun">Sun Software</div>
                  <div className="text-muted-foreground mt-2">نور التقنية في خدمتك</div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 gradient-sun text-sun-darker">تواصل معنا</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              احجز <span className="text-gradient-sun">موعدك</span> الآن
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-xl">نموذج الحجز</CardTitle>
                <CardDescription>أدخل بياناتك وسنتواصل معك خلال 24 ساعة</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background border-border focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="05xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="bg-background border-border focus:border-primary"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">الخدمة المطلوبة</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                    >
                      <SelectTrigger className="bg-background border-border focus:border-primary">
                        <SelectValue placeholder="اختر الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serial">خدمات السريال</SelectItem>
                        <SelectItem value="remote">التحكم عن بعد</SelectItem>
                        <SelectItem value="both">كلا الخدمتين</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">رسالتك</Label>
                    <Textarea
                      id="message"
                      placeholder="اكتب رسالتك هنا..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="bg-background border-border focus:border-primary resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-sun text-sun-darker font-semibold text-lg hover-lift"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "جاري الإرسال..."
                    ) : (
                      <>
                        <Send className="w-5 h-5 ml-2" />
                        إرسال الطلب
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">معلومات التواصل</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 gradient-sun rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-sun-darker" />
                    </div>
                    <div>
                      <div className="font-medium">الهاتف</div>
                      <div className="text-muted-foreground" dir="ltr">+966 50 123 4567</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 gradient-sun rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-sun-darker" />
                    </div>
                    <div>
                      <div className="font-medium">البريد الإلكتروني</div>
                      <div className="text-muted-foreground">info@sunsoftware.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 gradient-sun rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-sun-darker" />
                    </div>
                    <div>
                      <div className="font-medium">العنوان</div>
                      <div className="text-muted-foreground">الرياض، المملكة العربية السعودية</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 gradient-sun rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-sun-darker" />
                    </div>
                    <div>
                      <div className="font-medium">ساعات العمل</div>
                      <div className="text-muted-foreground">السبت - الخميس: 9 ص - 9 م</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-bold mb-4">تابعنا على</h3>
                <div className="flex gap-4">
                  {[
                    { icon: Facebook, href: "#", label: "Facebook" },
                    { icon: Twitter, href: "#", label: "Twitter" },
                    { icon: Instagram, href: "#", label: "Instagram" },
                    { icon: Linkedin, href: "#", label: "LinkedIn" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-12 h-12 gradient-card border border-border rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-200"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="aspect-video rounded-2xl gradient-card border border-border flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">خريطة الموقع</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/sun-software-logo.png"
                  alt="Sun Software"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-gradient-sun">Sun Software</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                شركة رائدة في تقديم الخدمات البرمجية عن بعد. نقدم حلولاً تقنية مبتكرة وموثوقة
                لعملائنا في جميع أنحاء العالم.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Linkedin, href: "#" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-sun-darker transition-all duration-200"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                {navLinks.slice(0, 4).map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold text-lg mb-4">خدماتنا</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#services"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    خدمات السريال
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    التحكم عن بعد
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    الأسعار
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    تواصل معنا
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Sun Software. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                الشروط والأحكام
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 w-12 h-12 gradient-sun rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all duration-200 z-50"
        aria-label="العودة للأعلى"
      >
        <ArrowUp className="w-6 h-6 text-sun-darker" />
      </button>
    </div>
  );
}
