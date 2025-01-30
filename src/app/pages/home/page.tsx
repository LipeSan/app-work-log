"use client"

import Header from '@/components/custom/header'
import { AmountCard } from '@/components/custom/amount-card'
import Loading from '@/components/custom/loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [worklogs, setWorklogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalHours, setTotalHours] = useState('00:00');
  const [totalAsHours, setTotalAsHours] = useState(0);
  const [rate, setRate] = useState(0);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    getRate();
    getWorklogs();
  }, [])

  const getWorklogs = async () => {
    setLoading(true);
    setItem(null);
    setError("");
    try {
      const response = await fetch('/api/worklogs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json()
      if (data.error) {
        if (data.error === "Unauthorized") {
          router.push('/pages/login')
        }
        setError(data.error)
      } else {
        setWorklogs(data.worklogs);
        getTotalHours(data.worklogs);
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const getRate = async () => {
    try {
      const response = await fetch('/api/rates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error)
      } else {
        setRate(data.rateObject.rate);
      }
    } catch (err) {
      setError("Something went wrong")
    }
  }

  const handleRowClick = (item: any) => {
    setItem(item);
    setOpen(true);
  };

  const getTotalHoursByDay = (worklog:any) => {
    const inicio = moment(worklog.startTime, "HH:mm");
    const fim = moment(worklog.endTime, "HH:mm");
    const durationHours = fim.diff(inicio, 'hours');
    const durationMinutes = fim.diff(inicio, 'minutes') % 60;
    return `${durationHours}:${durationMinutes}`
  }

  const getTotalHours = (worklogList:[]) => {
    let totalDuration = moment.duration({ hours: 0, minutes: 0 });
    worklogList.map(element => {
      const duration = getTotalHoursByDay(element).split(":");
      totalDuration = totalDuration.add(moment.duration({ hours: Number(duration[0]), minutes: Number(duration[1]) }));
    })
    setTotalHours(`${Math.floor(totalDuration.asHours())}:${totalDuration.minutes()}`);
    setTotalAsHours(totalDuration.asHours())
  }

  return (
    <>
      {loading ? <Loading /> : null}
      <Header refresh={getWorklogs} open={open} worklog={item} setOpen={setOpen}/>
      <div className="grid mt-5 p-2">
          <AmountCard title="Total Hours" amount={totalHours} />
          <AmountCard title="Total Money" amount={`$${(rate*totalAsHours).toFixed(2)}`} />
      </div>
      <div className="grid grid-rows-[0px_1fr_20px] justify-items-center min-h-screen p-2 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="rounded-md border w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='font-bold'>Date</TableHead>
                <TableHead className='font-bold'>Start</TableHead>
                <TableHead className='font-bold'>End</TableHead>
                <TableHead className='font-bold'>Total</TableHead>
                <TableHead className='font-bold'>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {worklogs.map((worklog) => (
                <TableRow 
                  key={worklog.id} 
                  className="cursor-pointer"
                  onClick={() => handleRowClick(worklog)}
                >
                  <TableCell>{moment(worklog.date).format("DD/MM/YYYY")}</TableCell>
                  <TableCell>{worklog.startTime}</TableCell>
                  <TableCell>{worklog.endTime}</TableCell>
                  <TableCell>{getTotalHoursByDay(worklog)}</TableCell>
                  <TableCell>{worklog.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}