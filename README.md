# TFF Tournament Hub

TFF — eFOOTBALL TOURNAMENT HUB
TRIAD FOOTBALL FEDERATION 

Build a modern, premium, responsive eFootball Tournament Management Platform for an organization called TFF.

TFF regularly conducts eFootball tournaments among friends and players. The website should become the official digital hub for TFF tournaments, allowing organizers to create new tournaments, manage teams, generate fixtures, record results, calculate standings, manage knockout stages, and preserve the complete history of every tournament.

The website should feel like a real esports/football organization platform rather than a basic CRUD dashboard.

1. BRANDING

Organization:

TFF

Platform name:

TFF eFootball

Website title:

TFF Tournament Hub

Tagline:

Compete. Conquer. Create History.

Use TFF consistently throughout the application.

Examples of tournaments:

TFF Summer Cup 2026

TFF Champions League 2026

TFF Winter Cup 2026

TFF Championship 2027

Do not use "AYOKI" or any other organization name.

Create a clean TFF logo placeholder that can later be replaced with the actual TFF logo.

2. CORE PURPOSE

The platform must support the complete tournament lifecycle:

TFF Organizer
↓
Create Tournament
↓
Configure Format
↓
Add Teams
↓
Generate Fixtures
↓
Tournament Begins
↓
Enter Match Results
↓
Standings Update Automatically
↓
Knockout Stage
↓
Final
↓
Crown Champion
↓
Archive Tournament

Every completed tournament must remain available in TFF's historical archive.

When a new tournament is created, it must NOT affect previous tournaments.

3. DESIGN DIRECTION

Create a premium football + esports visual identity.

Design inspiration:

Modern football competition websites

UEFA-style tournament presentation

eFootball esports interfaces

Modern gaming dashboards

Visual style:

Dark background

Black / charcoal surfaces

White typography

TFF brand accent color

Subtle gradients

Glassmorphism used carefully

Sharp football/esports aesthetic

Rounded cards

Clean spacing

Professional typography

Smooth micro-interactions

Subtle animations

Avoid:

Generic SaaS dashboard appearance

Excessive gradients

Excessive glass effects

Cartoon-like football graphics

Cluttered layouts

The website should look professional enough that TFF could use it as its permanent tournament website.

4. PUBLIC WEBSITE NAVIGATION

Create the following main navigation:

TFF Logo

Home

Tournaments

Teams

Rankings

About TFF

Right side:

Admin Login

On mobile, use a clean hamburger menu.

5. HOMEPAGE

Create a strong esports-style hero section.

Headline:

TFF eFOOTBALL

Large supporting text:

COMPETE. CONQUER. CREATE HISTORY.

Description:

"TFF is a competitive eFootball tournament organization bringing players together through organized competitions, intense matches and unforgettable finals."

Buttons:

View Tournaments

Tournament History

Use a subtle football stadium/eFootball-inspired background.

Do not make the hero overly busy.

6. CURRENT TOURNAMENT

Below the hero, display the currently active TFF tournament.

Example:

TFF SUMMER CUP 2026

Show:

Tournament logo

Tournament status

Number of teams

Matches played

Matches remaining

Current leader

Tournament dates

Button:

View Tournament

If there is no active tournament, show:

No Active Tournament

"Stay tuned for the next TFF competition."

Button:

Explore Tournament History

7. LATEST RESULTS

Create a section:

Latest Results

Display recent completed matches.

Each match card:

TEAM LOGO
Team Name

Score

Team Name
TEAM LOGO

Show:

Matchday

Date

Competition

Final score

Example:

TFF Summer Cup
Matchday 4

Team Alpha 3 — 1 Team Omega

Button:

View All Results

8. UPCOMING MATCHES

Create:

Upcoming Matches

Display upcoming fixtures.

Example:

TFF Summer Cup
Matchday 5

Team Alpha
VS
Team United

19:30
12 AUG 2026

Button:

View Fixture

9. TOURNAMENT HISTORY

Create a major homepage section:

TFF Tournament Archive

Subtitle:

"Every tournament. Every result. Every champion."

Display previous tournaments as premium cards.

Each card should show:

Tournament logo

Tournament name

Year

Dates

Number of teams

Matches

Champion

Tournament status

Example:

TFF Summer Cup 2026

🏆 Champion
TEAM ALPHA

8 Teams
28 Matches

View Tournament

10. TOURNAMENTS PAGE

Create:

TFF Tournaments

Show all tournaments.

Tabs:

All

Upcoming

Live

Completed

Filters:

Year

Format

Status

Search:

Search tournaments...

Tournament cards should include:

Logo

Tournament name

Year

Format

Team count

Status

Champion if completed

Clicking a tournament opens its full tournament page.

11. TOURNAMENT DETAIL PAGE

Every tournament needs its own dedicated page.

Example URL structure:

/tournament/tff-summer-cup-2026

Header:

Tournament logo

TFF SUMMER CUP 2026

Status:
LIVE

Dates:
10 AUG 2026 — 20 AUG 2026

Teams:
8

Navigation tabs:

Overview

Fixtures

Results

Standings

Teams

Knockout

Statistics

12. TOURNAMENT OVERVIEW

Show:

Tournament Status

Upcoming / Live / Completed

Tournament Information

Organizer: TFF

Format

Number of teams

Start date

End date

Rules

Progress

Example:

Matches Played
18 / 28

Progress bar.

Current Leader

Show:

Team Logo

TEAM ALPHA

18 Points

Latest Results

Show the latest 3–5 matches.

Next Matches

Show upcoming fixtures.

13. TEAM DATABASE

Create a global TFF team database.

Page:

TFF Teams

Every team should have:

Team name

Short name

Logo

Manager/player

Team color

Date created

Teams must be reusable across multiple tournaments.

For example:

TEAM ALPHA can participate in:

TFF Summer Cup 2026
TFF Winter Cup 2026
TFF Champions League 2027

The team should retain its historical participation.

14. TEAM PROFILE

Create a dedicated team profile.

Example:

TEAM ALPHA

Show:

Team logo

Team name

Manager

TFF tournaments participated

Tournament wins

Matches played

Wins

Draws

Losses

Goals scored

Goals conceded

Goal difference

Win percentage

Championships

Tournament History

Display:

Tournament
Year
Position
Matches
Wins
Points

15. FIXTURE SYSTEM

This is one of the most important features.

The system must automatically generate fixtures according to the tournament format.

Support:

Single Round Robin

Each team plays every other team once.

Double Round Robin

Each team plays every other team twice.

Group Stage

Teams are divided into groups.

Single Elimination

Knockout tournament.

League + Knockout

League stage followed by playoffs.

16. ROUND ROBIN FIXTURE GENERATOR

Implement a proper round-robin scheduling algorithm.

For example, with 6 teams:

Matchday 1

Team A vs Team F
Team B vs Team E
Team C vs Team D

Matchday 2

Team A vs Team E
Team F vs Team D
Team B vs Team C

Continue until all required matches are generated.

If the number of teams is odd, automatically create a BYE.

Do not allow:

A team playing itself

Duplicate fixtures

Missing fixtures

For double round robin, reverse home/away fixtures for the second round.

17. FIXTURE MANAGEMENT

Admin can:

Generate fixtures

Edit fixtures

Delete fixtures

Add manual fixtures

Change date

Change time

Change matchday

Reschedule matches

Each fixture should contain:

Home team

Away team

Tournament

Round

Matchday

Date

Time

Status

Statuses:

Scheduled

Live

Completed

Postponed

Cancelled

18. FIXTURE PAGE

Display fixtures grouped by matchday.

Example:

MATCHDAY 1

12 AUGUST 2026

Team Alpha
vs
Team Omega

19:00

Team United
vs
Team Kings

20:00

Use team logos prominently.

On mobile, fixtures should stack vertically.

19. RESULT MANAGEMENT

Admin should be able to select:

Enter Result

Display:

HOME TEAM

[ Score ]

—

[ Score ]

AWAY TEAM

Fields:

Home score

Away score

Match date

Match time

Notes

Optional screenshot

Optional player statistics:

Goalscorers

Assists

Player of the Match

After saving:

Automatically update:

Points

Wins

Draws

Losses

Goals For

Goals Against

Goal Difference

Standings

Tournament statistics

20. LEAGUE STANDINGS

Create a professional football standings table.

Columns:

POS
TEAM
P
W
D
L
GF
GA
GD
PTS

Example:

1
TEAM ALPHA
6
5
1
0
21
7
+14
16

Default points:

Win = 3
Draw = 1
Loss = 0

Allow TFF admin to customize these values.

21. TIE-BREAK RULES

Default ranking order:

Points

Goal Difference

Goals Scored

Head-to-Head

Manual admin decision if still tied

Make tie-breaking configurable from tournament settings.

22. KNOCKOUT SYSTEM

For tournaments that include playoffs, create a visual knockout bracket.

Support:

Round of 16

Quarter Finals

Semi Finals

Final

Third Place

Example:

QUARTER FINAL

TEAM A ─────┐
├──── TEAM A
TEAM B ─────┘

TEAM C ─────┐
├──── TEAM D
TEAM D ─────┘

SEMI FINAL

TEAM A ─────┐
├──── ?
TEAM D ─────┘

FINAL

? ──────────┐
├──── 🏆 CHAMPION
? ──────────┘

When a knockout result is entered, automatically advance the winner.

23. CHAMPION SYSTEM

When the final result is entered, mark the tournament as:

COMPLETED

Create a championship section:

🏆 TFF CHAMPION

Large team logo

TEAM ALPHA

TFF SUMMER CUP 2026 CHAMPIONS

Also show:

Runner-up
Third Place
Final Score

Optional:

Tournament MVP
Top Scorer

Create a celebratory but professional animation.

24. TOURNAMENT STATISTICS

Create:

Tournament Statistics

Team statistics:

Most wins

Most goals

Best goal difference

Best defense

Most points

Match statistics:

Total matches

Total goals

Average goals per match

Highest scoring match

Biggest victory

Player statistics if enabled:

Top scorer

Most assists

Most MOTM awards

Use clean charts and statistic cards.

25. TFF RANKINGS

Create an organization-wide ranking system.

Page:

TFF Rankings

Rank teams based on their performance across TFF tournaments.

Show:

POS
TEAM
TOURNAMENTS
WINS
TITLES
POINTS

Allow TFF to configure the ranking points system.

Example:

Tournament Winner = 100 points
Runner-up = 70 points
Semi-final = 50 points
Quarter-final = 30 points

The ranking system should be configurable rather than hardcoded.

26. TFF HALL OF CHAMPIONS

Create a special page:

TFF HALL OF CHAMPIONS

Show every tournament champion.

Example:

🏆 TFF SUMMER CUP 2026
TEAM ALPHA

🏆 TFF WINTER CUP 2026
TEAM UNITED

Each champion card should include:

Tournament

Year

Champion logo

Champion name

Final opponent

Final score

This should feel prestigious.

27. ADMIN AUTHENTICATION

Create secure TFF admin authentication using Supabase Auth.

Admin login:

Email
Password

Only authenticated TFF organizers can modify tournament data.

Public visitors can view tournament information without logging in.

Admin permissions:

Create tournament

Edit tournament

Delete tournament

Manage teams

Generate fixtures

Edit fixtures

Enter results

Edit results

Manage standings

Manage knockout

Manage statistics

Manage TFF rankings

28. ADMIN DASHBOARD

Create:

TFF ADMIN PANEL

Dashboard cards:

Total Tournaments
Active Tournaments
Completed Tournaments
Total Teams
Total Matches
Total Goals

Quick actions:

Create Tournament

Add Team

Generate Fixtures

Enter Result

Recent tournaments.

Recent matches.

Upcoming matches.

29. CREATE TOURNAMENT WIZARD

Make tournament creation simple.

STEP 1 — INFORMATION

Fields:

Tournament Name
Description
Tournament Logo
Banner
Start Date
End Date

TFF should automatically appear as the organizer.

STEP 2 — FORMAT

Options:

League
Round Robin
Double Round Robin
Group Stage
Knockout
League + Knockout

STEP 3 — SETTINGS

Configure:

Number of teams
Points for win
Points for draw
Points for loss
Tie-break rules
Home/Away
Number of groups
Qualification rules

STEP 4 — TEAMS

Options:

Select Existing TFF Teams

or

Create New Team

Prevent duplicate teams within the same tournament.

STEP 5 — FIXTURES

Show fixture preview.

Button:

Generate Fixtures

STEP 6 — REVIEW

Show:

Tournament information
Teams
Format
Fixture count
Rules

Button:

Create TFF Tournament

30. DATABASE

Use:

Frontend:
React + TypeScript

UI:
Tailwind CSS

Backend:
Supabase

Database:
PostgreSQL

Authentication:
Supabase Auth

Storage:
Supabase Storage

Store team logos, tournament logos, banners and match screenshots in Supabase Storage.

Do NOT store important tournament data only in localStorage.

31. DATABASE STRUCTURE

Create proper relational tables.

profiles

id
email
role
created_at

teams

id
name
short_name
logo_url
manager_name
team_color
created_at

tournaments

id
name
description
logo_url
banner_url
start_date
end_date
format
status
points_win
points_draw
points_loss
organizer
created_at

Organizer should default to:

TFF

tournament_teams

id
tournament_id
team_id
group_id

groups

id
tournament_id
name

fixtures

id
tournament_id
round
matchday
home_team_id
away_team_id
scheduled_date
scheduled_time
status

results

id
fixture_id
home_score
away_score
played_at
notes
screenshot_url

player_statistics

id
tournament_id
team_id
player_name
goals
assists
motm

tournament_statistics

id
tournament_id
team_id
matches_played
wins
draws
losses
goals_for
goals_against
goal_difference
points

tournament_rankings

id
tournament_id
team_id
position
points

champions

id
tournament_id
champion_team_id
runner_up_team_id
third_place_team_id

Use proper foreign keys, indexes and relationships.

32. DATA ISOLATION

This is extremely important.

Every tournament must have completely independent:

Fixtures

Results

Standings

Statistics

Knockout stages

Example:

TFF Summer Cup 2026

must never share fixture/result data with:

TFF Winter Cup 2026

However, the same global team can participate in both.

Historical team data should remain intact.

Deleting a tournament should require strong confirmation because it may contain historical records.

Prefer soft-delete/archive functionality where appropriate.

33. TOURNAMENT STATUS

Support:

DRAFT
UPCOMING
LIVE
COMPLETED
ARCHIVED

Workflow:

DRAFT
→ UPCOMING
→ LIVE
→ COMPLETED
→ ARCHIVED

Completed tournaments should remain available forever in the public TFF archive.

34. SEARCH

Implement global search.

Search:

Tournaments

Teams

Players

Results

Example:

Search "Alpha"

Should show:

Team Alpha
TFF Summer Cup 2026
TFF Winter Cup 2026
Previous results involving Team Alpha

35. MOBILE EXPERIENCE

The platform must be fully responsive.

Mobile users should easily access:

Active tournament

Standings

Upcoming fixtures

Latest results

Tournament history

Tables should horizontally scroll when necessary.

Knockout brackets should horizontally scroll.

Admin dashboard should work properly on mobile.

36. EMPTY STATES

Do not show blank pages.

Examples:

No tournaments:

"No TFF tournaments yet."

No active tournament:

"The next TFF competition is coming soon."

No results:

"No results have been recorded yet."

No teams:

"No teams have been registered."

Make empty states visually attractive.

37. DEMO DATA

Populate the initial application with realistic demo data.

Create:

Tournaments

TFF Summer Cup 2026
TFF Champions League 2026
TFF Winter Cup 2025

Teams

Create 8–12 fictional teams with logos/placeholders.

Example:

TFF United
Kerala Kings
Red Devils
Blue Warriors
FC Titans
Royal Eleven
Shadow FC
Phoenix FC
Galaxy XI
Storm FC

Create realistic fixtures and results.

Create realistic standings.

Create at least one completed tournament so the Hall of Champions and Tournament History look populated.

Keep demo data clearly separated so it can be removed later.

38. REUSABLE COMPONENTS

Create reusable React components:

TeamCard
TeamLogo
TeamProfile
TournamentCard
TournamentHeader
TournamentTabs
FixtureCard
ResultCard
StandingsTable
KnockoutBracket
ChampionCard
StatCard
RankingTable
AdminSidebar
TournamentWizard
MatchResultForm
SearchBar
FilterBar

Do not duplicate UI code unnecessarily.

39. VALIDATION

Prevent:

Team playing itself

Duplicate teams in tournament

Duplicate fixtures

Negative scores

Invalid results

Results for non-tournament teams

Invalid knockout advancement

Tournament creation without enough teams

Accidental deletion

Require confirmation before:

Deleting tournament

Deleting team

Deleting result

Regenerating fixtures

Overwriting completed tournament

If fixtures already have results, do NOT allow regeneration without an explicit warning.

40. PUBLIC VS ADMIN

PUBLIC:

Visitors can:

View tournaments

View fixtures

View results

View standings

View teams

View rankings

View statistics

View champions

View tournament history

ADMIN:

TFF organizers can modify everything.

Do not expose admin controls to public users.

41. PERFORMANCE

Keep the application fast.

Use:

Lazy loading where appropriate

Optimized images

Pagination for large historical datasets

Database indexes

Efficient Supabase queries

Proper caching where appropriate

Do not load every historical match at once.

42. SEO

Create good metadata for public tournament pages.

Example:

Title:

TFF Summer Cup 2026 | TFF eFootball

Description:

"Follow the TFF Summer Cup 2026 — fixtures, results, standings, teams and the eventual champion."

Use proper Open Graph metadata.

43. FINAL USER EXPERIENCE

The finished platform should feel like the permanent home of TFF eFootball.

A TFF organizer should be able to:

Create a new tournament
→ Add teams
→ Choose format
→ Generate fixtures
→ Conduct matches
→ Enter results
→ Automatically update standings
→ Manage knockout stage
→ Crown champion
→ Archive tournament

Then months or years later, everyone can return to the website and browse:

TFF Tournament History

and see every competition that has ever been conducted.

The platform should make TFF feel like an established competitive eFootball organization.

44. DEVELOPMENT PRIORITY

Build the application in this order:

PHASE 1

TFF branding

Public homepage

Supabase setup

Authentication

Database schema

Admin dashboard

PHASE 2

Team management

Tournament creation

Tournament history

PHASE 3

Fixture generation

Fixture management

Match result entry

Automatic standings

PHASE 4

Knockout bracket

Tournament completion

Champion system

PHASE 5

Statistics

TFF Rankings

Hall of Champions

PHASE 6

Mobile optimization

Animations

SEO

Performance improvements

Build production-quality code with reusable components and clean architecture.

Most importantly, do not build a fake frontend with hardcoded data. The tournament, team, fixture, result, standings and historical systems must be connected to the Supabase database and work dynamically.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aa1e85c6-15b9-4889-b78f-c05fca17b866).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
