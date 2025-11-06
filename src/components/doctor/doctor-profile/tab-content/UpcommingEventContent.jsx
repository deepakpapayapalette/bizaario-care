import React from "react";
import eventImage from "@assets/images/website/doctors/event.jpg";


const UpcommingEventContent = ({ doctorData }) => {
  // Use dynamic events from doctorData or fallback to static data
  const events = doctorData?.events || [
    {
      eventID: "LEUVG0",
      eventType: "OPD",
      eventTitle: "OPD Treatment",
      venue: "Venue",
      fees: "$100",
      dateFrom: "22/12/2025",
      dateTo: "22/12/2025",
      timeFrom: "10 AM",
      timeTo: "02 PM",
      instructions:
        "Instructions For Attendees Instructions For Attendees Instructions For Attendees Instructions For Attendees Instructions For Attendees Instructions For Attendees",
    },
    {
      eventID: "LEUVG0",
      eventType: "OPD",
      eventTitle: "OPD Treatment",
      venue: "Venue",
      fees: "$100",
      dateFrom: "22/12/2025",
      dateTo: "22/12/2025",
      timeFrom: "10 AM",
      timeTo: "02 PM",
      instructions:
        "Instructions For Attendees Instructions For Attendees Instructions For Attendees Instructions For Attendees Instructions For Attendees Instructions For Attendees",
    },
    {
      eventID: "LEUVG0",
      eventType: "OPD",
      eventTitle: "OPD Treatment",
      venue: "Venue",
      fees: "$100",
      dateFrom: "22/12/2025",
      dateTo: "22/12/2025",
      timeFrom: "10 AM",
      timeTo: "02 PM",
      instructions:
        "Instructions For Attendees Instructions For Attendees Instructions For Attendees Instructions For Attendees Instructions For Attendees Instructions For Attendees",
    },
  ];

  return (
    <div className="gap-6 ">
      {events.map((event, index) => (
        <div
          key={event._id || index}
          className="bg-[#f5f6f9] rounded-xl px-4 py-4 mb-5  "
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:gap-8">
            {/* Left blank area */}
            <div className="">
              <img
                src={event.image || eventImage}
                alt="img"
                className="w-full sm:max-w-[300px] h-auto"
              />
            </div>
            {/* Right details area */}
            <div className="flex flex-col w-full gap-4">
              <div className="flex flex-col gap-3 xl:flex-row">
                <div className="bg-[#e9ebef] rounded-md px-4 py-2  text-md  xl:w-1/2 ">
                  <span className="font-semibold text-md">Event ID :</span>{" "}
                  {event._id || event.eventID || "N/A"}
                </div>
                <div className="bg-[#e9ebef] rounded-md px-4 py-2  text-md  xl:w-1/2">
                  <span className="font-semibold text-md">Event Type :</span>{" "}
                  {event.EventTypeId?.lookup_value || event.eventType || "N/A"}
                </div>
              </div>
              <div className="bg-[#e9ebef] rounded-md px-4 py-2  text-md  ">
                <span className="font-semibold text-md">Event Title :</span>{" "}
                {event.EventTitle || event.eventTitle || "N/A"}
              </div>
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="bg-[#e9ebef] rounded-md px-4 py-2 lg:w-1/2 text-md  ">
                  <span className="font-semibold text-md">
                    <span className="lora">Venue :</span>
                  </span>{" "}
                  {event.EventVenue || event.venue || "N/A"}
                </div>
                <div className="bg-[#e9ebef] rounded-md px-4 py-2 lg:w-1/2 text-md text-md ">
                  <span className="font-semibold text-md">
                    <span className="lora">Fees :</span>{" "}
                    {event.RegistrationFee
                      ? `${event.RegistrationFee}`
                      : event.fees || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="bg-[#e9ebef] rounded-md px-4 py-2 lg:w-1/2 text-md text-sm ">
                  <div className="font-semibold text-md lora">Date</div>
                  <span>
                    <span className="lora">From : </span>
                    {event.dateFrom || "N/A"} &nbsp;&nbsp;|&nbsp;&nbsp;{" "}
                    <span className="lora">To : </span> {event.dateTo || "N/A"}
                  </span>
                </div>
                <div className="bg-[#e9ebef] rounded-md px-4 py-2 lg:w-1/2 text-md  ">
                  <div className="font-semibold text-md lora">Time</div>
                  <span>
                    From : {event.timeFrom || "N/A"} &nbsp;&nbsp;|&nbsp;&nbsp;To
                    : {event.timeTo || "N/A"}
                  </span>
                </div>
              </div>
              <div className="bg-[#e9ebef] rounded-md px-4 py-2  text-md ">
                <h3 className="text-lg font-semibold text-md">
                  Instructions For Attendees
                </h3>
                <span className="font-normal text-md">
                  {event.instructions ||
                    "Please follow the event guidelines and arrive on time."}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcommingEventContent;
