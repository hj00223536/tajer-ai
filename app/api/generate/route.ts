import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Kind = 'ad' | 'post' | 'product';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const kind = body.kind as Kind;
    const language = body.language === 'en' ? 'English' : 'Arabic';
    const product = String(body.product ?? '').trim().slice(0, 500);
    const audience = String(body.audience ?? '').trim().slice(0, 300);
    const tone = String(body.tone ?? 'احترافي').slice(0, 100);
    if (!product) return NextResponse.json({ error: 'اكتب اسم المنتج أو وصفه أولاً.' }, { status: 400 });
    if (!['ad', 'post', 'product'].includes(kind)) return NextResponse.json({ error: 'نوع الطلب غير صالح.' }, { status: 400 });

    const labels: Record<Kind, string> = { ad: 'إعلان تسويقي', post: 'منشور لوسائل التواصل', product: 'وصف منتج' };
    const prompt = `اكتب ${labels[kind]} باللغة ${language}. المنتج أو الخدمة: ${product}. الجمهور المستهدف: ${audience || 'عام'}. النبرة: ${tone}. اجعل النص جذاباً وواضحاً، ولا تخترع أسعاراً أو خصائص أو ضمانات غير مذكورة. أخرج النص النهائي فقط.`;
    const apiUrl = process.env.AI_API_URL;
    const apiKey = process.env.AI_API_KEY;
    if (apiUrl && apiKey) {
      const upstream = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: process.env.AI_MODEL || 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are TAJER AI, a careful bilingual marketing assistant. Never invent product facts.' }, { role: 'user', content: prompt }], temperature: 0.7 }),
        signal: AbortSignal.timeout(45000),
      });
      const data = await upstream.json();
      if (!upstream.ok) return NextResponse.json({ error: data?.error?.message || 'تعذر الاتصال بمزود الذكاء الاصطناعي.' }, { status: 502 });
      const output = data?.choices?.[0]?.message?.content;
      if (!output) return NextResponse.json({ error: 'لم يصل نص من مزود الذكاء الاصطناعي.' }, { status: 502 });
      return NextResponse.json({ output, provider: 'ai' });
    }

    const fallback = kind === 'ad'
      ? `✨ ${product}\n\nاكتشف ما يناسبك اليوم! جودة واهتمام بالتفاصيل وتجربة تستحق التجربة.\n\n📩 راسلنا لمعرفة المزيد والتفاصيل.\n\n${audience ? `موجّه إلى: ${audience}` : ''}`
      : kind === 'post'
      ? `🌟 ${product}\n\nكل يوم فرصة لاختيار أفضل. أخبرنا في التعليقات: ما أكثر شيء تبحث عنه؟\n\n📩 للتفاصيل، أرسل لنا رسالة.`
      : `${product}\n\nتعرّف على ${product} واكتشف خياراً عملياً يلائم احتياجاتك.\n\nللمواصفات الدقيقة والسعر والتوفر، يرجى التواصل معنا.`;
    return NextResponse.json({ output: language === 'English' ? `Discover ${product}! A thoughtful choice for your needs. Contact us for accurate specifications, pricing, and availability.` : fallback, provider: 'template' });
  } catch {
    return NextResponse.json({ error: 'حدث خطأ غير متوقع. حاول مرة أخرى.' }, { status: 500 });
  }
}
