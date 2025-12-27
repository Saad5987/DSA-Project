import java.util.*;

public class HousingAllocationSystem {
    
    // Priority Queue implementation for applications
    static class PriorityQueue {
        private List<Application> heap;
        
        public PriorityQueue() {
            heap = new ArrayList<>();
        }
        
        public void push(Application app, int priority) {
            heap.add(app);
            int i = heap.size() - 1;
            while (i > 0 && calculatePriority(heap.get(parent(i))) < priority) {
                Collections.swap(heap, i, parent(i));
                i = parent(i);
            }
        }
        
        public Application pop() {
            if (heap.isEmpty()) return null;
            
            Application result = heap.get(0);
            heap.set(0, heap.get(heap.size() - 1));
            heap.remove(heap.size() - 1);
            heapify(0);
            return result;
        }
        
        private void heapify(int i) {
            int largest = i;
            int left = leftChild(i);
            int right = rightChild(i);
            
            if (left < heap.size() && 
                calculatePriority(heap.get(left)) > calculatePriority(heap.get(largest))) {
                largest = left;
            }
            
            if (right < heap.size() && 
                calculatePriority(heap.get(right)) > calculatePriority(heap.get(largest))) {
                largest = right;
            }
            
            if (largest != i) {
                Collections.swap(heap, i, largest);
                heapify(largest);
            }
        }
        
        private int parent(int i) { return (i - 1) / 2; }
        private int leftChild(int i) { return 2 * i + 1; }
        private int rightChild(int i) { return 2 * i + 2; }
        
        public boolean isEmpty() {
            return heap.isEmpty();
        }
        
        public int size() {
            return heap.size();
        }
    }
    
    // Application class
    static class Application {
        String id;
        String name;
        int age;
        int familySize;
        double income;
        int priorityScore;
        
        public Application(String id, String name, int age, int familySize, double income) {
            this.id = id;
            this.name = name;
            this.age = age;
            this.familySize = familySize;
            this.income = income;
            this.priorityScore = calculatePriorityScore();
        }
        
        private int calculatePriorityScore() {
            int score = 0;
            
            // Age factor
            if (age >= 60) score += 30;
            else if (age >= 50) score += 20;
            else if (age >= 40) score += 10;
            
            // Family size factor
            if (familySize >= 6) score += 30;
            else if (familySize >= 4) score += 20;
            else if (familySize >= 2) score += 10;
            
            // Income factor
            double incomeRatio = income / 20000.0;
            if (incomeRatio <= 0.5) score += 40;
            else if (incomeRatio <= 0.75) score += 30;
            else if (incomeRatio <= 1.0) score += 20;
            else score += 10;
            
            return Math.min(100, score);
        }
        
        private int calculatePriority(Application app) {
            return app.priorityScore;
        }
    }
    
    // House class
    static class House {
        String id;
        String address;
        int bedrooms;
        double size;
        String type;
        
        public House(String id, String address, int bedrooms, double size, String type) {
            this.id = id;
            this.address = address;
            this.bedrooms = bedrooms;
            this.size = size;
            this.type = type;
        }
    }
    
    // Graph for location analysis
    static class LocationGraph {
        private Map<String, List<Edge>> adjacencyList;
        
        class Edge {
            String destination;
            double distance;
            
            Edge(String dest, double dist) {
                destination = dest;
                distance = dist;
            }
        }
        
        public LocationGraph() {
            adjacencyList = new HashMap<>();
        }
        
        public void addEdge(String house1, String house2, double distance) {
            adjacencyList.computeIfAbsent(house1, k -> new ArrayList<>())
                .add(new Edge(house2, distance));
            adjacencyList.computeIfAbsent(house2, k -> new ArrayList<>())
                .add(new Edge(house1, distance));
        }
        
        public List<String> findNearbyHouses(String start, double maxDistance) {
            List<String> nearby = new ArrayList<>();
            Set<String> visited = new HashSet<>();
            Queue<Pair> queue = new LinkedList<>();
            
            queue.add(new Pair(start, 0.0));
            
            while (!queue.isEmpty()) {
                Pair current = queue.poll();
                
                if (current.distance > maxDistance) continue;
                if (visited.contains(current.house)) continue;
                
                visited.add(current.house);
                if (!current.house.equals(start)) {
                    nearby.add(current.house);
                }
                
                if (adjacencyList.containsKey(current.house)) {
                    for (Edge edge : adjacencyList.get(current.house)) {
                        if (!visited.contains(edge.destination)) {
                            queue.add(new Pair(edge.destination, current.distance + edge.distance));
                        }
                    }
                }
            }
            
            return nearby;
        }
        
        class Pair {
            String house;
            double distance;
            
            Pair(String h, double d) {
                house = h;
                distance = d;
            }
        }
    }
    
    // Main allocation system
    static class AllocationSystem {
        private PriorityQueue priorityQueue;
        private LocationGraph locationGraph;
        
        public AllocationSystem() {
            priorityQueue = new PriorityQueue();
            locationGraph = new LocationGraph();
        }
        
        public void addApplication(Application app) {
            priorityQueue.push(app, app.priorityScore);
        }
        
        public AllocationResult allocateHousesGreedy(List<House> houses) {
            AllocationResult result = new AllocationResult();
            List<House> availableHouses = new ArrayList<>(houses);
            
            // Sort houses by bedrooms (descending)
            availableHouses.sort((h1, h2) -> Integer.compare(h2.bedrooms, h1.bedrooms));
            
            while (!priorityQueue.isEmpty()) {
                Application app = priorityQueue.pop();
                House bestHouse = null;
                double bestScore = -1;
                
                for (House house : availableHouses) {
                    double matchScore = calculateMatchScore(app, house);
                    if (matchScore > bestScore && matchScore >= 60) {
                        bestScore = matchScore;
                        bestHouse = house;
                    }
                }
                
                if (bestHouse != null) {
                    result.addAllocation(app, bestHouse, bestScore);
                    availableHouses.remove(bestHouse);
                }
            }
            
            return result;
        }
        
        private double calculateMatchScore(Application app, House house) {
            double score = 50.0;
            
            // Bedroom compatibility
            int idealBedrooms = (app.familySize + 1) / 2;
            int bedroomDiff = Math.abs(house.bedrooms - idealBedrooms);
            double bedroomScore = Math.max(0, 30 - (bedroomDiff * 10));
            score += bedroomScore;
            
            // Size adequacy
            double minSizePerPerson = 150.0;
            double requiredSize = app.familySize * minSizePerPerson;
            if (house.size >= requiredSize) {
                double sizeScore = Math.min(20, (house.size - requiredSize) / 50.0);
                score += sizeScore;
            }
            
            return Math.min(100.0, score);
        }
    }
    
    static class AllocationResult {
        private List<Allocation> allocations;
        
        public AllocationResult() {
            allocations = new ArrayList<>();
        }
        
        public void addAllocation(Application app, House house, double score) {
            allocations.add(new Allocation(app, house, score));
        }
        
        public List<Allocation> getAllocations() {
            return allocations;
        }
    }
    
    static class Allocation {
        Application application;
        House house;
        double matchScore;
        
        public Allocation(Application app, House h, double score) {
            application = app;
            house = h;
            matchScore = score;
        }
    }
    
    // Main method for testing
    public static void main(String[] args) {
        // Create sample applications
        List<Application> applications = Arrays.asList(
            new Application("APP-001", "Ali Khan", 45, 6, 15000),
            new Application("APP-002", "Sara Ahmed", 38, 4, 12000),
            new Application("APP-003", "Ahmed Raza", 50, 5, 10000)
        );
        
        // Create sample houses
        List<House> houses = Arrays.asList(
            new House("H-101", "123 Main St", 3, 1200, "apartment"),
            new House("H-102", "456 Park Rd", 4, 2000, "house"),
            new House("H-103", "789 Garden Ave", 5, 2500, "duplex")
        );
        
        // Test allocation system
        AllocationSystem system = new AllocationSystem();
        for (Application app : applications) {
            system.addApplication(app);
        }
        
        AllocationResult result = system.allocateHousesGreedy(houses);
        
        System.out.println("=== Housing Allocation Results ===");
        for (Allocation alloc : result.getAllocations()) {
            System.out.printf("Application: %s\n", alloc.application.name);
            System.out.printf("House: %s\n", alloc.house.id);
            System.out.printf("Match Score: %.2f\n", alloc.matchScore);
            System.out.println("---");
        }
    }
}