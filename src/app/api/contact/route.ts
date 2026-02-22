import { NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  phone: string;
  service: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.phone || !body.service) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب ملؤها" },
        { status: 400 }
      );
    }

    // Validate phone number format (Saudi format)
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { error: "رقم الهاتف غير صالح" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send SMS confirmation
    // For now, we'll just log and return success

    console.log("Contact form submission:", {
      name: body.name,
      phone: body.phone,
      service: body.service,
      message: body.message,
      timestamp: new Date().toISOString(),
    });

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: "تم استلام طلبك بنجاح، سنتواصل معك قريباً",
      data: {
        name: body.name,
        service: body.service,
      },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في معالجة طلبك" },
      { status: 500 }
    );
  }
}
