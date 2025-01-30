import Link from 'next/link'
import WorkLogPage from '../../app/pages/worklog/page'


interface DetailDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  worklog:any | null;
  refresh: () => void;
}

export default function Header({open, setOpen, worklog, refresh}: DetailDialogProps) {

  return (
    <header className="w-full bg-gray-500 text-white relative">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <Link href="/pages/home" className="text-xl font-bold">
            WorkLogger
          </Link>
          <div className="space-x-4">
            <WorkLogPage refresh={refresh} open={open} worklog={worklog} setOpen={setOpen}/>
            <Link href="/api/auth/signout" className="hover:text-gray-300">
              Logout
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}