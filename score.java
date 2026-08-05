import java.io.*;
import java.util.*;

public class score {
    private static final String SCORE_FILE = "scores.txt";
    private static final int MAX_SCORES = 100;

    public static class ScoreEntry {
        public String username;
        public String gameId;
        public String gameName;
        public int score;
        public String category;
        public String date;

        public ScoreEntry(String username, String gameId, String gameName, int score, String category) {
            this.username = username;
            this.gameId = gameId;
            this.gameName = gameName;
            this.score = score;
            this.category = category;
            this.date = new Date().toString();
        }

        public String toString() {
            return username + "|" + gameId + "|" + gameName + "|" + score + "|" + category + "|" + date;
        }

        public static ScoreEntry fromString(String line) {
            String[] parts = line.split("\\|");
            if (parts.length < 6) return null;
            ScoreEntry entry = new ScoreEntry(parts[0], parts[1], parts[2], Integer.parseInt(parts[3]), parts[4]);
            entry.date = parts[5];
            return entry;
        }
    }

    public static void addScore(String username, String gameId, String gameName, int score, String category) {
        List<ScoreEntry> scores = getScores();
        scores.add(new ScoreEntry(username, gameId, gameName, score, category));
        scores.sort((a, b) -> b.score - a.score);
        if (scores.size() > MAX_SCORES) {
            scores = scores.subList(0, MAX_SCORES);
        }
        saveScores(scores);
        System.out.println("[OK] Score saved: " + username + " - " + gameName + ": " + score + " pts");
    }

    public static List<ScoreEntry> getScores() {
        List<ScoreEntry> scores = new ArrayList<>();
        File file = new File(SCORE_FILE);
        if (!file.exists()) return scores;
        
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                ScoreEntry entry = ScoreEntry.fromString(line);
                if (entry != null) scores.add(entry);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return scores;
    }

    public static List<ScoreEntry> getScoresForGame(String gameId) {
        List<ScoreEntry> all = getScores();
        List<ScoreEntry> filtered = new ArrayList<>();
        for (ScoreEntry entry : all) {
            if (entry.gameId.equals(gameId)) {
                filtered.add(entry);
            }
        }
        filtered.sort((a, b) -> b.score - a.score);
        return filtered;
    }

    public static List<ScoreEntry> getScoresForCategory(String category) {
        List<ScoreEntry> all = getScores();
        List<ScoreEntry> filtered = new ArrayList<>();
        for (ScoreEntry entry : all) {
            if (entry.category.equals(category)) {
                filtered.add(entry);
            }
        }
        filtered.sort((a, b) -> b.score - a.score);
        return filtered;
    }

    public static List<ScoreEntry> getTopScores(int limit) {
        List<ScoreEntry> all = getScores();
        all.sort((a, b) -> b.score - a.score);
        if (all.size() > limit) {
            return all.subList(0, limit);
        }
        return all;
    }

    private static void saveScores(List<ScoreEntry> scores) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(SCORE_FILE))) {
            for (ScoreEntry entry : scores) {
                writer.write(entry.toString());
                writer.newLine();
            }
            System.out.println("[SAVED] Scores saved to " + SCORE_FILE);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void clearScores() {
        File file = new File(SCORE_FILE);
        if (file.exists()) {
            file.delete();
            System.out.println("[CLEARED] All scores cleared");
        }
    }

    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("=== LEADERBOARD ===");
            System.out.println();
            System.out.println("Commands:");
            System.out.println("  java score add <username> <gameId> <gameName> <score> <category>");
            System.out.println("  java score list");
            System.out.println("  java score game <gameId>");
            System.out.println("  java score category <category>");
            System.out.println("  java score clear");
            System.out.println();
            System.out.println("Categories: space, arcade, sim");
            return;
        }

        String command = args[0].toLowerCase();

        switch (command) {
            case "add":
                if (args.length < 6) {
                    System.out.println("[ERROR] Usage: java score add <username> <gameId> <gameName> <score> <category>");
                    return;
                }
                String username = args[1];
                String gameId = args[2];
                String gameName = args[3];
                int score = Integer.parseInt(args[4]);
                String category = args[5];
                addScore(username, gameId, gameName, score, category);
                break;

            case "list":
                System.out.println("=== TOP SCORES ===");
                List<ScoreEntry> top = getTopScores(20);
                if (top.isEmpty()) {
                    System.out.println("No scores yet. Play a game!");
                } else {
                    for (int i = 0; i < top.size(); i++) {
                        ScoreEntry e = top.get(i);
                        String medal = i == 0 ? "[GOLD]" : i == 1 ? "[SILVER]" : i == 2 ? "[BRONZE]" : "[" + (i+1) + "]";
                        System.out.println(medal + " " + e.username + " - " + e.gameName + ": " + e.score + " pts");
                    }
                }
                break;

            case "game":
                if (args.length < 2) {
                    System.out.println("[ERROR] Usage: java score game <gameId>");
                    return;
                }
                String gid = args[1];
                List<ScoreEntry> gameScores = getScoresForGame(gid);
                System.out.println("=== " + gid + " Scores ===");
                if (gameScores.isEmpty()) {
                    System.out.println("No scores for this game yet.");
                } else {
                    for (int i = 0; i < Math.min(10, gameScores.size()); i++) {
                        ScoreEntry e = gameScores.get(i);
                        System.out.println("  " + (i+1) + ". " + e.username + ": " + e.score + " pts");
                    }
                }
                break;

            case "category":
                if (args.length < 2) {
                    System.out.println("[ERROR] Usage: java score category <category>");
                    return;
                }
                String cat = args[1];
                List<ScoreEntry> catScores = getScoresForCategory(cat);
                System.out.println("=== " + cat + " Category Scores ===");
                if (catScores.isEmpty()) {
                    System.out.println("No scores for this category yet.");
                } else {
                    for (int i = 0; i < Math.min(10, catScores.size()); i++) {
                        ScoreEntry e = catScores.get(i);
                        System.out.println("  " + (i+1) + ". " + e.username + " - " + e.gameName + ": " + e.score + " pts");
                    }
                }
                break;

            case "clear":
                clearScores();
                break;

            default:
                System.out.println("[ERROR] Unknown command: " + command);
                System.out.println("Available commands: add, list, game, category, clear");
        }
    }
}
