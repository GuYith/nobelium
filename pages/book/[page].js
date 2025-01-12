import { config } from '@/lib/server/config'
import { useConfig } from '@/lib/config'
import BookPagination from '@/components/BookPagination'
import Container from '@/components/Container'
import Book from '@/components/Book'
import { getAllBooks } from '@/lib/notion'

const Page = ({ booksToShow, page, showNext }) => {
  const { title, description } = useConfig()
  return (
    <Container title={title} description={description} fullWidth={true}>
      {booksToShow && <div className='flex flex-wrap gap-4'>
        {booksToShow.map(book => (
        <Book key={book.id} book={book}/>
      ))}
      </div>}
      <BookPagination page={page} showNext={showNext} />
    </Container>
  )
}

export async function getStaticProps (context) {
  const { page } = context.params // Get Current Page No.
  const books = await getAllBooks({})
  const booksToShow = books.slice(
    config.bookPerPage *(page-1),
    config.bookPerPage * page
  )
  const totalBooks = books.length
  const showNext = page * config.bookPerPage < totalBooks
  return {
    props: {
      page, // current page is 1
      booksToShow,
      showNext
    },
    revalidate: 1
  }
}

export async function getStaticPaths () {
  const books = await getAllBooks({})
  const totalBooks = books.length
  const totalPages = Math.ceil(totalBooks / config.bookPerPage)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}
export default Page
