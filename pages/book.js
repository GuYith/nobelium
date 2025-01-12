import { clientConfig } from '@/lib/server/config'
import Book from '@/components/Book'
import Container from '@/components/Container'
import { useConfig } from '@/lib/config'
import { getAllBooks } from '@/lib/notion/getAllBooks'
import BookPagination from '@/components/BookPagination'

export async function getStaticProps () {
  const books = await getAllBooks({})
  const booksToShow = books.slice(0, clientConfig.bookPerPage)
  // const totalPosts = posts.length
  const showNext = true
  return {
    props: {
      page: 1, // current page is 1
      booksToShow,
      showNext
    },
    revalidate: 1
  }
}

export default function BookList ({ booksToShow, page, showNext }) {
  const { title, description, bookListIntroduction } = useConfig()

  return (
    <Container title={title} description={description} fullWidth={true}>
      <div className='flex flex-wrap gap-4'>
        {booksToShow.map(book => (
        <Book key={book.id} book={book}/>
      ))}
      </div>
      {showNext && <BookPagination page={page} showNext={showNext} />}
    </Container>
  )
}



