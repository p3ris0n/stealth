import { Check, Clock3, MapPin, Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import type { MailEvent } from "../types";
import "../styles.css";

export function EventMailCard({ event }: { event: MailEvent }) {
  return (
    <div className="event-mail-hero relative mb-6 mt-7 h-[220px] max-w-[480px] overflow-hidden rounded-2xl border border-white/[0.09] shadow-[0_24px_72px_-42px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] xl:max-w-[520px]">
      <div className="event-mail-ridges" />
      <div className="event-calendar-card absolute left-[55%] top-1/2 z-10 w-[min(260px,calc(100%-1.5rem))] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-white/[0.13] p-3.5 text-foreground shadow-[0_28px_70px_-36px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.16)]">
        <div className="mail-reader-meta flex items-center gap-2 text-[10px] text-muted-foreground">
          <button className="rounded-md border border-white/[0.13] bg-white/70 px-4 py-1.5 font-medium text-background">
            {event.cadence}
          </button>
          <button className="rounded-md px-3 py-1.5 transition hover:bg-white/[0.06] hover:text-foreground">Monthly</button>
          <button className="ml-auto rounded-md p-1.5 text-muted-foreground transition hover:bg-white/[0.06] hover:text-foreground">
            <Settings2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="mail-reader-title text-[32px] font-medium leading-none text-foreground/90">{event.month}</div>
          <div className="mail-reader-title text-[32px] font-medium leading-none text-foreground/90">{event.day}</div>
        </div>

        <div className="mail-reader-meta mt-3.5 grid grid-cols-7 gap-1.5 text-center">
          {event.days.map((day) => (
            <div key={`${day.label}-${day.date}`} className="space-y-1">
              <div className="text-[9px] uppercase text-muted-foreground/75">{day.label}</div>
              <div
                className={
                  day.active
                    ? "mx-auto grid h-4.5 w-4.5 place-items-center rounded-md bg-white/70 text-[9px] font-semibold text-background shadow-[0_0_18px_rgba(255,255,255,0.16)]"
                    : "text-[9px] font-medium text-foreground/74"
                }
              >
                {day.date}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3.5 flex items-center gap-2">
          <div className="mail-reader-meta min-w-0 flex-1 space-y-0.5 text-[9px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock3 className="h-2.5 w-2.5" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
          <button className="mail-reader-meta inline-flex items-center gap-1 rounded-md bg-black/60 px-2.5 py-1.5 text-[9px] font-medium text-foreground transition hover:bg-black/75">
            <Plus className="h-2.5 w-2.5" />
            Add
          </button>
        </div>
      </div>

      <div className="mail-reader-meta absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground">
        <span className="rounded-md border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 backdrop-blur-xl">
          Upcoming event
        </span>
        <span className="rounded-md border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 backdrop-blur-xl">
          {event.note}
        </span>
      </div>
    </div>
  );
}
