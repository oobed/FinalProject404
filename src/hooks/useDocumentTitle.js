import { useEffect } from 'react'

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} - Song Review Hub` : 'Song Review Hub'
  }, [title])
}

export default useDocumentTitle
