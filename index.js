const https = require("https");

async function getUsernames(threshold) {
	let options = {
		hostname: "jsonmock.hackerrank.com",
		path: "/api/article_users?page=1",
		method: "GET",
	};

	function request(options) {
		let fullData = new Promise(function (resolve, reject) {
			https
				.get(options, (res) => {
					res.setEncoding("utf8");
					let data = "";

					res.on("data", (chunk) => {
						data += chunk;
					});

					res.on("end", () => {
						data = JSON.parse(data);
						resolve(data);
					});
				})
				.on("error", (err) => {
					console.log("Error: " + err.message);
				});
		});
		return fullData;
	}
	let data = await request(options);
	let finalData = data.data;
	if (data.total_pages > 1) {
		for (let i = 2; i <= data.total_pages; i++) {
			options.path = options.path.slice(0, -1) + i;
			let newData = await request(options);
			newData = newData.data;
			finalData = [...finalData, ...newData];
		};
	};

	const usernames = finalData
		.filter((user) => user.submission_count >= threshold)
		.map((user) => user.username);

	console.log(usernames);
	console.log(data.total_pages);
	return usernames;
}
async function main() {
	try {
		let test = await getUsernames(1000);
		return test;
	} catch (err) {
		console.log(err);
	}
}
main();