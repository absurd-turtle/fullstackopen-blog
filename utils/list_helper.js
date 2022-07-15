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

const mostBlogs = (blogs) => {
  let blogMap = blogs.reduce((previous, current) => {
    if (previous[current.author]) {
      previous[current.author] += 1
    }
    else {
      previous[current.author] = 1
    }
    return previous
  }, {})
  let bestEntry = Object.entries(blogMap).sort((a, b) => b[1] - a[1])[0]
  return {
    author: bestEntry[0],
    blogs: bestEntry[1]
  }
}

const mostLikes = (blogs) => {
  let blogMap = blogs.reduce((previous, current) => {
    if (previous[current.author]) {
      previous[current.author] += current.likes
    }
    else {
      previous[current.author] = current.likes
    }
    return previous
  }, {})
  let bestEntry = Object.entries(blogMap).sort((a, b) => b[1] - a[1])[0]
  return {
    author: bestEntry[0],
    likes: bestEntry[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
