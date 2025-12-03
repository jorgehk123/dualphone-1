import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validación mínima
    if (!body?.amount || !body?.items) {
      return NextResponse.json(
        { status: "error", message: "Datos incompletos" },
        { status: 400 }
      );
    }

    // Log para pruebas (puedes verlo en consola del servidor)
    console.log("Pago simulado recibido:", body);

    // Respuesta de éxito simulado
    return NextResponse.json({
      status: "success",
      message: "Pago procesado (simulado)",
    });
  } catch (err) {
    console.error("Error en pago simulado:", err);

    return NextResponse.json(
      { status: "error", message: "Error procesando datos" },
      { status: 400 }
    );
  }
}
