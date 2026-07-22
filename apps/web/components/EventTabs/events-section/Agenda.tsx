import { convertTo12Hour } from "../utils";

export default function AgendaSection ({ agenda, allSpeakers }: { agenda: any[], allSpeakers: any[] }) {
  if (!agenda || agenda.length === 0) {
    return <p className="text-gray-500 text-center py-8">No agenda items available</p>;
  }

  return (
  <div className="space-y-0">
  {agenda && agenda.length > 0 ? (
    [...agenda]
      .sort((a, b) => a.timeFrom.localeCompare(b.timeFrom))
      .map((item: any, index: number) => (
        <div key={index}>
                  {/* MAIN AGENDA */}
                  <div className="flex gap-3 sm:gap-4">
                    {/* Agenda Time */}
                   <div
  className="
    ml-auto
    w-20 sm:w-40
    flex-shrink-0
    text-right
    text-[10px] sm:text-sm
    font-medium
    text-gray-500
    pt-1
  "
>
  {convertTo12Hour(item.timeFrom)}
  {" - "}
  {convertTo12Hour(item.timeTo)}
</div>


                    {/* Big Dot + Line */}
                    <div
                      className="
              flex flex-col
              items-center
              w-4 sm:w-6
              flex-shrink-0
            "
                    >
                      <div
                        className="
                w-2 h-2
                rounded-full
                bg-gray-400
                mt-1.5
                z-10
              "
                      />

                      <div
                        className="
                w-px
                flex-1
                min-h-[45px]
                bg-gray-200
                mt-1
              "
                      />
                    </div>

                    {/* Agenda Content */}
                   <div className={`${item.description?.trim() ? "flex-grow pb-6" : "flex-grow pb-0"}`}>
                      <h3
                        className="
                text-sm sm:text-lg
                font-medium
                text-gray-900
              "
              
                      >
                        {item.title}
                      </h3>

                      {item.description && (
                        <p
                          className="
                  text-[10px]
                  sm:text-xs
                  text-gray-500
                  leading-relaxed
                "
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* SPEAKERS */}
                 {item.speakers?.map((speaker: any, speakerIndex: number) => {
                   const speakerDetails = allSpeakers
  ?.flatMap(
    (section:any) =>
      section.speakers || []
  )
  .find(
    (s:any) =>
      s.name === speaker.name
  );

                    return (
                      <div key={speakerIndex} className="flex gap-3 sm:gap-4">
                        {/* Speaker Time */}
                        <div
  className="
    ml-auto
    w-20 sm:w-40
    flex-shrink-0
    text-right
    text-[8px]
    sm:text-[10px]
    font-medium
    text-black/80
    pt-2
  "
>
  {speaker.timeFrom && speaker.timeTo && (
    <>
      {convertTo12Hour(speaker.timeFrom)}
      {" - "}
      {convertTo12Hour(speaker.timeTo)}
    </>
  )}
</div>
                        {/* Small Dot + Line */}
                        <div
                          className="
                    flex flex-col
                    items-center
                    w-4 sm:w-6
                    flex-shrink-0
                  "
                        >
                          <div
                            className="
                      w-1.5 h-1.5
                      rounded-full
                      bg-gray-400
                      mt-2
                      z-10
                    "
                          />

                          <div
                            className="
                      w-px
                      flex-1
                      min-h-[50px]
                      bg-gray-200
                      mt-1
                    "
                          />
                        </div>

                        {/* Speaker Details */}
                        <div
                          className="
                          -mt-4
                    flex
                    items-start
                    gap-2 sm:gap-3
                    pb-6
                    flex-grow
                  "
                        >
                          {speakerDetails?.image ? (
                            <img
                              src={speakerDetails.image}
                              alt={speaker.name}
                              loading="lazy"
                              decoding="async"
                              className="
                          w-8 h-8
                          sm:w-12 sm:h-12
                          rounded-full
                          object-cover
                          bg-gray-100
                        "
                            />
                          ) : (
                            <div
                              className="
                        w-8 h-8
                        sm:w-10 sm:h-10
                        rounded-full
                        bg-gray-200
                        flex
                        items-center
                        justify-center
                        text-xs
                        font-bold
                        text-gray-500
                      "
                            >
                              {speaker.name?.charAt(0)}
                            </div>
                          )}

                          <div>
                            <p
                              className="
                        
                        text-sm sm:text-base
                        font-bold
                        text-gray-900
                      "
                            >
                              {speaker.name}
                            </p>

                            {speakerDetails?.roles?.length > 0 && (

  <div className="space-y-0.5">

    {speakerDetails.roles.map(
      (role:any,index:number)=>(

        <p
          key={index}
          className="
            text-xs
            sm:text-sm
            text-gray-700
            leading-tight
          "
        >

          {role.designation}


          {role.company && (
            <>
              {" | "}
              {role.company}
            </>
          )}

        </p>

      )
    )}

    {speaker.topic?.trim() && (
  <p
    className="
      mt-1
     text-xs
            sm:text-sm
      font-medium
      text-gray-900
      leading-relaxed
    "
  >
  {speaker.topic}
  </p>
)}

  </div>
  

)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No agenda items available
              </p>
            )}
          </div>
  );
}