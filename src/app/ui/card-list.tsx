'use client';


export default function CardList({ children }: { children: JSX.Element[] | JSX.Element }) {
  return (
    <div className="relative bg-greyblue p-8 pt-0 flex flex-col items-center space-y-8 overflow-scroll">
        {children}
    </div>
  );
}
