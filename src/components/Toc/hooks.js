import { useEffect, useRef } from 'react'

const useIntersectionObserver = (setActiveId) => {
  const headingElementsRef = useRef({})

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))

    const callback = (headings) => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        // eslint-disable-next-line no-param-reassign
        map[headingElement.target.id] = headingElement
        return map
      }, headingElementsRef.current)

      const visibleHeadings = []
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key]
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement)
      })

      const getIndexFromId = id => (
        headingElements.findIndex(heading => heading.id === id)
      )

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id)
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) > getIndexFromId(b.target.id),
        )
        setActiveId(sortedVisibleHeadings[0].target.id)
      }
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -40% 0px',
    })

    headingElements.forEach(element => observer.observe(element))

    return () => observer.disconnect()
  }, [setActiveId])
}

export default useIntersectionObserver
