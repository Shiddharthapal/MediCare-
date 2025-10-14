import type { APIRoute } from "astro";

interface CreateMeetRequest {
  appointmentId: string;
  doctorName: string;
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  reasonForVisit: string;
  doctorEmail?: string;
}

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const body = await request.json();
    const {
      appointmentId,
      doctorName,
      patientName,
      patientEmail,
      appointmentDate,
      appointmentTime,
      reasonForVisit,
      doctorEmail,
    } = body;

    // In production, retrieve the doctor's access token from database
    const accessToken = process.env.GOOGLE_ACCESS_TOKEN;

    if (!accessToken) {
      // For demo purposes, generate a mock Meet link
      const mockMeetLink = `https://meet.google.com/mock-${appointmentId.substring(0, 8)}`;

      return new Response(
        JSON.stringify({
          message: "Invalid access token",
        })
      );
    }

    // Parse date and time
    const [hours, minutes] = appointmentTime.split(/[: ]/);
    const isPM = appointmentTime.toLowerCase().includes("pm");
    let hour = Number.parseInt(hours);
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    const startDateTime = new Date(appointmentDate);
    startDateTime.setHours(hour, Number.parseInt(minutes), 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30); // 30-minute appointment

    // Create Google Calendar event with Meet
    const event = {
      summary: `Telemedicine Appointment: ${reasonForVisit}`,
      description: `Video consultation between ${doctorName} and ${patientName}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "America/New_York",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "America/New_York",
      },
      attendees: [
        { email: patientEmail },
        ...(doctorEmail ? [{ email: doctorEmail }] : []),
      ],
      conferenceData: {
        createRequest: {
          requestId: `appointment-${appointmentId}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("[v0] Calendar API error:", result);
      throw new Error(
        result.error?.message || "Failed to create calendar event"
      );
    }

    const meetLink = result.hangoutLink;

    return new Response(
      JSON.stringify({
        success: true,
        meetLink,
        eventId: result.id,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error("[v0] Create Meet error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create Meet link",
      }),
      { status: 500, headers }
    );
  }
};
