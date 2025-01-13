import FormattedDate from "@/components/FormattedDate";
import { useConfig } from "@/lib/config";
import Link from "next/link";
import { isUrl } from "notion-utils";

const BlogPost = ({ post }) => {
  const BLOG = useConfig();

  return (
    <Link href={`${BLOG.path}/${post.slug}`}>
      {post.pageCover ?
      <article key={post.id} className="mb-6 md:mb-8 group hover:-ml-8 hover:mr-8 flex justify-between relative">
        <div >
          <header className="flex flex-col justify-between md:flex-row md:items-baseline">
            <h2 className="text-lg md:text-xl font-medium mb-2 cursor-pointer text-black dark:text-gray-100">
              {isUrl(post.pageIcon) ?
            <img src={post.pageIcon} className="inline w-7 h-7"></img>
          : post.pageIcon} {post.title}
            </h2>
          </header>
          <main >
            <p className="hidden md:block leading-8 text-gray-700 dark:text-gray-300">
              {post.summary}
            </p>
          </main>
          <time className="flex-shrink-0 text-gray-600 dark:text-gray-400 absolute -bottom-2">
              <FormattedDate date={post.date} />
          </time>
        </div>
          <img src={post.pageCover} className="ml-3 min-w-56 max-w-56 h-36 object-cover"></img>
      </article>
      :
      <article key={post.id} className="mb-6 md:mb-8 hover:-ml-8 hover:mr-8">
        <header className="flex flex-col justify-between md:flex-row md:items-baseline">
          <h2 className="text-lg md:text-xl font-medium mb-2 cursor-pointer text-black dark:text-gray-100">
            {isUrl(post.pageIcon) ?
            <img src={post.pageIcon} className="inline w-7 h-7"></img>
          : post.pageIcon} {post.title}
          </h2>
          <time className="flex-shrink-0 text-gray-600 dark:text-gray-400">
            <FormattedDate date={post.date} />
          </time>
        </header>
        <main>
          <p className="hidden md:block leading-8 text-gray-700 dark:text-gray-300">
            {post.summary}
          </p>
        </main>
    </article>
    }
    </Link>
  );
};

export default BlogPost;
