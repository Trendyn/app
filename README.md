[![wercker status](https://app.wercker.com/status/e356bd87db869cf8859ca9f8eef83feb/m "wercker status")](https://app.wercker.com/project/bykey/e356bd87db869cf8859ca9f8eef83feb)

Code Review Process
---------------------------------------------
Always checkout new branch for any changes using following command.
git checkout -b <branch-name>

After changes are complete, commit and push new branch using following commands.
git add <files>
git commit
git push origin <branch-name>

Now visit github.com and open a pull request for review.
Once pull request is created opynios continuous integration environment will start automated build, stage and test process.

