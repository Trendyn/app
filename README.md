
Code Review Process
---------------------------------------------
Always checkout new branch for any changes using following command.
1. git checkout -b <branch-name>

After changes are complete, commit and push new branch using following commands.
1. git add <files>
2. git commit
3. git push origin <branch-name>

Now visit github.com and open a pull request for review.
Once pull request is created opynios continuous integration environment will start automated build, stage and test process.

