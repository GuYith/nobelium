import FormattedDate from "@/components/FormattedDate";

const Book = ({ book }) => {

  return (
      <div key={book.id} className="mb-6 md:mb-8 flex">
        <div className="border-2 p-10">
         <img src={book.cover} className="w-56 h-80 object-cover mb-2"></img>
          <header className="w-56 flex flex-col justify-between md:flex-row md:items-baseline ">
            <h2 className="text-ellipsis text-lg md:text-lg font-medium mb-2 cursor-pointer text-black dark:text-gray-100">
              {book.name}
            </h2>
              {book.score}
          </header>
          <main className="w-56">
            <div>
            <p className="hidden text-base md:block leading-8 text-gray-700 dark:text-gray-300">
              {book.author}
            </p>
            <p className="hidden text-base md:block leading-8 text-gray-700 dark:text-gray-300">
            {book.press}
            </p>
            </div>
            <div className="flex items-center">
              <p className="text-sm mr-1 flex-shrink-0 text-gray-600 dark:text-gray-400">Completed</p>
            <time className="text-sm flex-shrink-0 text-gray-600 dark:text-gray-400">
              <FormattedDate date={book.date} />
            </time>
            </div>
          </main>
          </div>
      </div>
  );
};

export default Book;
