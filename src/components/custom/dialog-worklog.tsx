"use client"

import Loading from "@/components/custom/loading"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

 interface DetailDialogPropsTest {
  open: boolean;
  setOpen: (open: boolean) => void;
  worklog: any | null;
  refresh: () => void;
}

//export default function WorkLogPage({ open, setOpen, worklog, refresh }: DetailDialogProps) {
const WorkLogPage: React.FC<DetailDialogPropsTest> = ({ open, setOpen, worklog, refresh }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("17:30");
  const [endTime, setEndTime] = useState("22:30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    console.log(worklog);

    if (worklog) {
      setEdit(true);
      setDate(new Date(worklog.date));
      setStartTime(worklog.startTime);
      setEndTime(worklog.endTime);
    } else {
      setEdit(false);
    }
  }, [worklog])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = !edit ? await fetch('/api/worklogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, startTime, endTime }),
      }) :
        await fetch(`/api/worklogs/${worklog.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date, startTime, endTime }),
        })

      if (!response.ok) {
        throw new Error('Signup failed');
      }
      setOpen(false);
      refresh()
    } catch (err) {
      console.log("ERROR: ", err);
      setError("Something went wrong during signup")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/worklogs/${worklog.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Delete failed');
      }
      refresh();
      setOpen(false);
    } catch (err) {
      console.log("ERROR: ", err);
      setError("Something went wrong during delete")
    } finally {
      setLoading(false)
    }

  }

  const handleOpen = () => {
    setDate(new Date());
    setStartTime("17:30");
    setEndTime("22:30");
    setOpen(true);
    setEdit(false);
  }

  return (
    <div>
      {loading ? <Loading /> : null}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => handleOpen()}>Create Worklog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{edit ? 'Edit this' : 'Create a new'} Worklog</DialogTitle>
            <DialogDescription>
              Fill in the details for your work log entry.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="startTime">Start Time</label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="endTime">End Time</label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex place-content-between">
            <Button onClick={handleSave}>Save Worklog</Button>
            {edit ? <Button className="bg-red-500" onClick={handleDelete}>Delete</Button> : null}

          </div>
        </DialogContent>
      </Dialog>
      {error ? <div className="text-red-500 text-center">{error}</div> : null}
    </div>
  )
}

export default WorkLogPage;