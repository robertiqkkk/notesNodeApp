const totalLikes = (blogs) => {
	return blogs.reduce((acc, blog) => {
		const likes = blog.likes;
		const isNumber = typeof likes === "number" && Number.isFinite(likes);
		return isNumber ? acc + likes : acc;
	}, 0);
};

const favoriteBlog = (blogs) => {
	return blogs.sort((blogA, blogB) => {
		return blogB.likes - blogA.likes;
	})[0];
};

const topBlog = (blogs) => {
	let authors = {};
	let biggestBlog = {
		author: null,
		blogs: 0,
	};
	blogs.forEach((blog) => {
		if (authors[blog.author]) {
			authors[blog.author].blogs += 1;
		} else {
			authors[blog.author] = {
				author: blog.author,
				blogs: 1,
			};
		}
	});
	Object.keys(authors).forEach((author) => {
		if (authors[author].blogs > biggestBlog.blogs) {
			biggestBlog = authors[author];
		}
	});
	return biggestBlog;
};

const mostLikes = (blogs) => {
	let authors = {};
	let biggestBlog = {
		author: null,
		likes: 0,
	};
	blogs.forEach((blog) => {
		if (authors[blog.author]) {
			authors[blog.author].likes += blog.likes;
		} else {
			authors[blog.author] = {
				author: blog.author,
				likes: blog.likes,
			};
		}
	});
	Object.keys(authors).forEach((author) => {
		if (authors[author].likes > biggestBlog.likes) {
			biggestBlog = authors[author];
		}
	});
	return biggestBlog;
};

module.exports = {
	totalLikes,
	favoriteBlog,
	topBlog,
	mostLikes,
};
