import { LoaderCircle } from 'lucide-react';

export default function Loading(){
    return(
        <div className="flex items-center justify-center min-h-screen absolute w-full bg-gray-500 opacity-50">
                <LoaderCircle className='animate-pulse animate-spin'/>
                <span className='ml-3'>Loading...</span>
        </div>
    )
}