// npm
import { Medal } from 'lucide-react';
import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import Link from 'next/link';

// shadcn-ui
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const headingFont = localFont({
   src: '../../public/fonts/font.woff2',
});

const PoppinFont = Poppins({
   subsets: ['latin'],
   weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const MarketingPage = () => {
   return (
      <div className="flex items-center justify-center flex-col">
         <div
            className={cn(
               'flex items-center justify-center flex-col',
               headingFont.className,
            )}
         >
            <div className="mb-4 flex justify-center items-center border shadow-sm p-6 bg-amber-100 text-amber-700 uppercase rounded-full">
               <Medal className="w-8 h-6 m-2" />
               <span className="text-md px-3">
                  더존비즈온 ERP물류개발2Cell 일정 관리 by.우성
               </span>
            </div>
            <h1 className="text-3xl md:text-6xl text-center text-neutral-600 mb-8">
               Taskify helps team
            </h1>
            <div className="text-3xl md:text-6xl text-center bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-6 pb-2 p-2 rounded-lg w-fit">
               work forward
            </div>
         </div>
         <div
            className={cn(
               'text-xs md:text-xl text-neutral-400 mt-7 max-w-md md:max-w-2xl text-center mx-auto',
               PoppinFont.className,
            )}
         >
            Collaborate
         </div>
         <Button className="mt-6" size={'lg'} asChild>
            <Link href={'/sign-up'}>
               Get Taskify for free!! 공짜로 이용해라 이거야 !
            </Link>
         </Button>
      </div>
   );
};

export default MarketingPage;
