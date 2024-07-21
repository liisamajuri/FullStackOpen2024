const { test, describe, expect, beforeEach } = require("@playwright/test");
const {
  loginWith,
  createBlog,
  likeBlog,
  deleteBlog,
  checkDeleteButtonVisible,
} = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
      await expect(
        page.getByText("Matti Luukkainen (mluukkai) logged in"),
      ).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "wrong");
      const errorDiv = await page.locator(".error");
      await expect(errorDiv).toContainText("Wrong credentials");

      await expect(
        page.getByText("Matti Luukkainen (mluukkai) logged in"),
      ).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      const testblog = {
        title: "Test Title",
        author: "Test Author",
        url: "http://testurl.com",
      };
      await createBlog(page, testblog, true);
      await expect(page.getByText("No blogs found")).not.toBeVisible();
      await expect(page.getByText("Test Title Test Authorview")).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      const testblog = {
        title: "Test Title",
        author: "Test Author",
        url: "http://testurl.com",
        likes: 0,
      };
      await createBlog(page, testblog);
      await likeBlog(page, testblog.title);
      await expect(page.getByText("view")).not.toBeVisible();
      await expect(page.getByText("hide")).toBeVisible();
      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("the user who created the blog can delete it", async ({ page }) => {
      const testblog = {
        title: "Test Title",
        author: "Test Author",
        url: "http://testurl.com",
        likes: 0,
      };
      await createBlog(page, testblog);
      await deleteBlog(page, testblog);
      await expect(
        page.getByText(`${testblog.title} ${testblog.author}hide`),
      ).not.toBeVisible();
    });

    test("only the user who created the blog can see the delete button", async ({
      page,
      request,
    }) => {
      const testblog = {
        title: "Test Title",
        author: "Test Author",
        url: "http://testurl.com",
        likes: 0,
      };
      await createBlog(page, testblog);
      await checkDeleteButtonVisible(page);

      await page.getByRole("button", { name: "Logout" }).click();

      await request.post("/api/users", {
        data: {
          name: "Test User",
          username: "testuser",
          password: "testpassword",
        },
      });

      await loginWith(page, "testuser", "testpassword");
      await expect(
        page.getByText("Test User (testuser) logged in"),
      ).toBeVisible();
      await expect(
        page.getByText("Test Title Test Authorview"),
      ).not.toBeVisible();
    });
  });

  describe("When several blogs exist", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");

      const testblog1 = {
        title: "First Test Title",
        author: "First Test Author",
        url: "http://firsttesturl.com",
        likes: 0,
      };
      await createBlog(page, testblog1);

      const testblog2 = {
        title: "Second Test Title",
        author: "Second Test Author",
        url: "http://secondtesturl.com",
        likes: 0,
      };
      await createBlog(page, testblog2);
      await likeBlog(page, testblog2.title);
      await page.getByRole("button", { name: "hide" }).click();

      const testblog3 = {
        title: "Third Test Title",
        author: "Third Test Author",
        url: "http://thirdtesturl.com",
        likes: 0,
      };
      await createBlog(page, testblog3);
      await likeBlog(page, testblog3.title);
      await page.getByRole("button", { name: "hide" }).click();
      await likeBlog(page, testblog3.title);
      await page.getByRole("button", { name: "hide" }).click();

      await page.waitForTimeout(1000);
    });

    test("blogs are sorted by likes", async ({ page }) => {
      const blogTitles = await page.$$eval(".blog-title", (blogs) =>
        blogs.map((blog) => blog.innerText.replace("view", "").trim()),
      );
      //console.log(blogTitles);

      expect(blogTitles).toEqual([
        "Third Test Title Third Test Author",
        "Second Test Title Second Test Author",
        "First Test Title First Test Author",
      ]);
    });
  });
});
