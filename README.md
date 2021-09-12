# Code Coach Browser Extension

Browser extension for Code Coach. No duh.

Icon attribution: https://dribbble.com/shots/12675462-Cool-Monkey

## Next steps

* Make a web server for this.
* Send events to the web server.
* There only needs to be triggers on the "successful submission" event. All other events can just
  write to the database directly.
* The "successful submission" event will write to database, but that write will also consolidate all
  events in the attempt into a single consolidated event row with things like:
  * Number of submissions.
  * Start time/end time.
  * Duration.
  * Key stats about code (time, memory, lines, etc)
  * Etc etc.
* We should also capture the code that gets submitted and log it.
  * Log the final code.
