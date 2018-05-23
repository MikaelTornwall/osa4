const dummy = (blog) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  console.log(likes)
  return blogs.length === 0 ? 0 : likes
}

const favoriteBlog = (blogs) => {
  const arr = blogs
  arr.sort((a, b) => {
    return b.likes - a.likes
  })
  console.log(arr[0])
  const returnObj = {
    title: arr[0].title,
    author: arr[0].author,
    likes: arr[0].likes
  }
  console.log(returnObj)
  return returnObj
}

const mostBlogs = (blogs) => {
  let obj = {}
  let arr = []

  for (var i = 0; i < blogs.length; i++) {
    let number = blogs[i].author
    obj[number] = obj[number] ? obj[number] + 1 : 1
  }

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      arr.push({
        author: i,
        blogs: obj[i]
      })
    }
  }

  const sort = arr.sort((a, b) => {
    return b.blogs - a.blogs
  })

  return sort[0]
}

const mostLikes = (blogs) => {
  let obj = {}
  let arr = []

  for (var i = 0; i < blogs.length; i++) {
    let likes = blogs[i].author
    obj[likes] = obj[likes] ? obj[likes] + blogs[i].likes : blogs[i].likes
  }

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      arr.push({
        author: i,
        likes: obj[i]
      })
    }
  }

  const sort = arr.sort((a, b) => {
    return b.likes - a.likes
  })
  console.log(sort[0])
  return sort[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
