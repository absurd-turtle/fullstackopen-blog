const dummy = (blogs) => {
  return 1
}

const totalLikes = (posts) => {
  return posts.reduce((previous, current) => {
    return previous + current.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((previous, current) => {
    return current.likes > previous.likes ? current : previous
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
