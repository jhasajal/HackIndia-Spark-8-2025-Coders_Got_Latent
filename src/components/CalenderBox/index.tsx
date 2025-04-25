"use client"

import { useState } from "react"
import { Edit2, Save, X, Clock } from "lucide-react"

type TimeSlot = {
  startTime: string
  endTime: string
}

type TimetableData = {
  [day: string]: {
    [periodIndex: number]: string
  }
}

const TimeTable = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    Array(10)
      .fill(0)
      .map((_, i) => ({
        startTime: `${8 + Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
        endTime: `${8 + Math.floor((i + 1) / 2)}:${(i + 1) % 2 === 0 ? "00" : "30"}`,
      })),
  )

  const [timetableData, setTimetableData] = useState<TimetableData>(() => {
    const initialData: TimetableData = {}
    days.forEach((day) => {
      initialData[day] = {}
      for (let i = 0; i < 10; i++) {
        initialData[day][i] = "NA"
      }
    })
    return initialData
  })

  const [editingCell, setEditingCell] = useState<{ day: string; period: number } | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null)
  const [isEditingTime, setIsEditingTime] = useState(false)
  const [tempValue, setTempValue] = useState("")
  const [tempTimeSlot, setTempTimeSlot] = useState<TimeSlot>({ startTime: "", endTime: "" })

  const handleCellClick = (day: string, period: number) => {
    setEditingCell({ day, period })
    setTempValue(timetableData[day][period])
  }

  const handlePeriodSelect = (index: number) => {
    setSelectedPeriod(index === selectedPeriod ? null : index)
    setIsEditingTime(false)
  }

  const handleTimeEdit = (index: number) => {
    setIsEditingTime(true)
    setSelectedPeriod(index)
    setTempTimeSlot({
      startTime: timeSlots[index].startTime,
      endTime: timeSlots[index].endTime,
    })
  }

  const saveCell = () => {
    if (editingCell) {
      const { day, period } = editingCell
      setTimetableData((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          [period]: tempValue,
        },
      }))
      setEditingCell(null)
    }
  }

  const saveTime = () => {
    if (selectedPeriod !== null) {
      setTimeSlots((prev) => {
        const newTimeSlots = [...prev]
        newTimeSlots[selectedPeriod] = tempTimeSlot
        return newTimeSlots
      })
      setIsEditingTime(false)
    }
  }

  const cancelEdit = () => {
    setEditingCell(null)
    setIsEditingTime(false)
  }

  return (
    <div className="w-full max-w-full overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-dark">
      {/* Period selection header */}
      <div className="flex items-center justify-between bg-gray-100 p-2 dark:bg-gray-800">
        <h3 className="font-medium text-dark dark:text-white">Select Period:</h3>
        <div className="flex space-x-2 overflow-x-auto">
          {timeSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => handlePeriodSelect(index)}
              className={`flex items-center rounded-md px-3 py-1 text-sm ${
                selectedPeriod === index
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <span>Period {index + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time slot editor */}
      {selectedPeriod !== null && (
        <div className="bg-gray-50 p-3 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-primary" />
              <span className="font-medium text-dark dark:text-white">
                Period {selectedPeriod + 1}: {timeSlots[selectedPeriod].startTime} - {timeSlots[selectedPeriod].endTime}
              </span>
            </div>
            {!isEditingTime ? (
              <button
                onClick={() => handleTimeEdit(selectedPeriod)}
                className="flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
              >
                <Edit2 size={14} className="mr-1" />
                Edit Time
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={saveTime}
                  className="flex items-center rounded-md bg-green-100 px-2 py-1 text-xs text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300"
                >
                  <Save size={14} className="mr-1" />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center rounded-md bg-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
                >
                  <X size={14} className="mr-1" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {isEditingTime && (
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600 dark:text-gray-300">Start:</span>
                <input
                  type="text"
                  value={tempTimeSlot.startTime}
                  onChange={(e) => setTempTimeSlot((prev) => ({ ...prev, startTime: e.target.value }))}
                  className="rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="HH:MM"
                />
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600 dark:text-gray-300">End:</span>
                <input
                  type="text"
                  value={tempTimeSlot.endTime}
                  onChange={(e) => setTempTimeSlot((prev) => ({ ...prev, endTime: e.target.value }))}
                  className="rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="HH:MM"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timetable grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-[120px_repeat(10,minmax(80px,1fr))] bg-primary text-white">
              <th className="flex h-10 items-center justify-center p-1 text-sm font-medium">
                Day / Period
              </th>
              {timeSlots.map((_, index) => (
                <th key={index} className="flex h-10 items-center justify-center p-1 text-sm font-medium">
                  {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, dayIndex) => (
              <tr key={day} className="grid grid-cols-[120px_repeat(10,minmax(80px,1fr))]">
                <td className="flex h-12 items-center justify-center border border-gray-200 bg-gray-50 p-1 text-sm font-medium dark:border-gray-700 dark:bg-gray-800">
                  <span className="hidden lg:block">{day}</span>
                  <span className="block lg:hidden">{shortDays[dayIndex]}</span>
                </td>

                {Array(10).fill(0).map((_, periodIndex) => (
                  <td
                    key={`${day}-${periodIndex}`}
                    className={`relative h-12 cursor-pointer border border-gray-200 p-1 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 ${
                      editingCell?.day === day && editingCell?.period === periodIndex
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                    onClick={() => handleCellClick(day, periodIndex)}
                  >
                    {editingCell && editingCell.day === day && editingCell.period === periodIndex ? (
                      <div className="flex h-full items-center">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                          autoFocus
                        />
                        <div className="absolute right-1 top-1 flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              saveCell()
                            }}
                            className="rounded bg-green-500 p-1 text-white"
                          >
                            <Save size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              cancelEdit()
                            }}
                            className="rounded bg-red-500 p-1 text-white"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm">
                        <span className={timetableData[day][periodIndex] === "NA" ? "text-gray-400" : "font-medium"}>
                          {timetableData[day][periodIndex]}
                        </span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Time slot legend */}
      <div className="mt-2 border-t border-gray-200 p-2 text-xs text-gray-500 dark:border-gray-700">
        <ul className="flex flex-wrap gap-2">
          {timeSlots.map((slot, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-1 font-medium">P{index + 1}:</span>
              <span>{slot.startTime}-{slot.endTime}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TimeTable