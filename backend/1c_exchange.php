<?php
/**
 * 1C:Enterprise CommerceML2 Integration Endpoint
 * Handles product import/export between 1C and the e-commerce system
 */

header('Content-Type: text/plain; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Configuration
define('EXCHANGE_LOG_FILE', __DIR__ . '/logs/1c_exchange.log');
define('EXCHANGE_DATA_DIR', __DIR__ . '/1c_data');
define('MAX_EXECUTION_TIME', 300);

// Ensure directories exist
if (!file_exists(dirname(EXCHANGE_LOG_FILE))) {
    mkdir(dirname(EXCHANGE_LOG_FILE), 0755, true);
}
if (!file_exists(EXCHANGE_DATA_DIR)) {
    mkdir(EXCHANGE_DATA_DIR, 0755, true);
}

ini_set('max_execution_time', MAX_EXECUTION_TIME);

class CommerceML2Handler {
    private $logFile;
    private $dataDir;
    private $sessionId;
    private $allowedIPs = ['127.0.0.1', '::1']; // Add your 1C server IPs here
    
    public function __construct() {
        $this->logFile = EXCHANGE_LOG_FILE;
        $this->dataDir = EXCHANGE_DATA_DIR;
        $this->sessionId = session_id() ?: uniqid('1c_', true);
    }
    
    public function handleRequest() {
        try {
            $this->log("Request started: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);
            
            // Basic IP filtering (optional)
            if (!$this->isAllowedIP()) {
                $this->log("Access denied for IP: " . $_SERVER['REMOTE_ADDR']);
                http_response_code(403);
                echo "failure\nAccess denied";
                return;
            }
            
            $type = $_GET['type'] ?? '';
            $mode = $_GET['mode'] ?? '';
            
            switch ($type) {
                case 'catalog':
                    $this->handleCatalog($mode);
                    break;
                case 'sale_info':
                    $this->handleSaleInfo($mode);
                    break;
                default:
                    $this->log("Unknown type: $type");
                    echo "failure\nUnknown type";
            }
        } catch (Exception $e) {
            $this->log("Error: " . $e->getMessage());
            echo "failure\n" . $e->getMessage();
        }
    }
    
    private function handleCatalog($mode) {
        switch ($mode) {
            case 'checkauth':
                $this->checkAuth();
                break;
            case 'init':
                $this->initCatalog();
                break;
            case 'file':
                $this->receiveFile();
                break;
            case 'import':
                $this->importCatalog();
                break;
            default:
                $this->log("Unknown catalog mode: $mode");
                echo "failure\nUnknown mode";
        }
    }
    
    private function handleSaleInfo($mode) {
        switch ($mode) {
            case 'checkauth':
                $this->checkAuth();
                break;
            case 'init':
                $this->initSaleInfo();
                break;
            case 'file':
                $this->receiveFile();
                break;
            case 'import':
                $this->importSaleInfo();
                break;
            default:
                $this->log("Unknown sale_info mode: $mode");
                echo "failure\nUnknown mode";
        }
    }
    
    private function checkAuth() {
        $username = $_SERVER['PHP_AUTH_USER'] ?? '';
        $password = $_SERVER['PHP_AUTH_PW'] ?? '';
        
        // Simple authentication - you should implement proper auth
        if ($username === '1c_user' && $password === '1c_password') {
            $this->log("Authentication successful for user: $username");
            echo "success\n";
            echo "sessid\n";
            echo $this->sessionId;
        } else {
            $this->log("Authentication failed for user: $username");
            http_response_code(401);
            header('WWW-Authenticate: Basic realm="1C Exchange"');
            echo "failure\nAuthentication failed";
        }
    }
    
    private function initCatalog() {
        $this->log("Catalog initialization started");
        echo "zip=no\n";
        echo "file_limit=1048576\n"; // 1MB file limit
        echo "sessid\n";
        echo $this->sessionId;
    }
    
    private function initSaleInfo() {
        $this->log("Sale info initialization started");
        echo "zip=no\n";
        echo "file_limit=1048576\n";
        echo "sessid\n";
        echo $this->sessionId;
    }
    
    private function receiveFile() {
        $filename = $_GET['filename'] ?? '';
        if (empty($filename)) {
            echo "failure\nNo filename specified";
            return;
        }
        
        $this->log("Receiving file: $filename");
        
        // Get raw POST data
        $data = file_get_contents('php://input');
        if (empty($data)) {
            echo "failure\nNo data received";
            return;
        }
        
        $filePath = $this->dataDir . '/' . basename($filename);
        
        if (file_put_contents($filePath, $data) !== false) {
            $this->log("File saved: $filePath (" . strlen($data) . " bytes)");
            echo "success";
        } else {
            $this->log("Failed to save file: $filePath");
            echo "failure\nCould not save file";
        }
    }
    
    private function importCatalog() {
        $filename = $_GET['filename'] ?? '';
        if (empty($filename)) {
            echo "failure\nNo filename specified";
            return;
        }
        
        $filePath = $this->dataDir . '/' . basename($filename);
        if (!file_exists($filePath)) {
            echo "failure\nFile not found";
            return;
        }
        
        $this->log("Starting catalog import from: $filename");
        
        try {
            $result = $this->parseCommerceML($filePath);
            if ($result) {
                $this->log("Catalog import completed successfully");
                echo "success";
            } else {
                $this->log("Catalog import failed");
                echo "failure\nImport failed";
            }
        } catch (Exception $e) {
            $this->log("Catalog import error: " . $e->getMessage());
            echo "failure\n" . $e->getMessage();
        }
    }
    
    private function importSaleInfo() {
        $filename = $_GET['filename'] ?? '';
        if (empty($filename)) {
            echo "failure\nNo filename specified";
            return;
        }
        
        $filePath = $this->dataDir . '/' . basename($filename);
        if (!file_exists($filePath)) {
            echo "failure\nFile not found";
            return;
        }
        
        $this->log("Starting sale info import from: $filename");
        
        try {
            $result = $this->parsePricesML($filePath);
            if ($result) {
                $this->log("Sale info import completed successfully");
                echo "success";
            } else {
                $this->log("Sale info import failed");
                echo "failure\nImport failed";
            }
        } catch (Exception $e) {
            $this->log("Sale info import error: " . $e->getMessage());
            echo "failure\n" . $e->getMessage();
        }
    }
    
    private function parseCommerceML($filePath) {
        $xml = simplexml_load_file($filePath);
        if (!$xml) {
            throw new Exception("Could not parse XML file");
        }
        
        $this->log("Parsing CommerceML catalog file");
        
        // Parse categories (Классификатор)
        if (isset($xml->Классификатор->Группы->Группа)) {
            $this->parseCategories($xml->Классификатор->Группы->Группа);
        }
        
        // Parse products (Каталог)
        if (isset($xml->Каталог->Товары->Товар)) {
            $this->parseProducts($xml->Каталог->Товары->Товар);
        }
        
        return true;
    }
    
    private function parsePricesML($filePath) {
        $xml = simplexml_load_file($filePath);
        if (!$xml) {
            throw new Exception("Could not parse XML file");
        }
        
        $this->log("Parsing CommerceML prices file");
        
        // Parse offers (Предложения)
        if (isset($xml->ПакетПредложений->Предложения->Предложение)) {
            $this->parseOffers($xml->ПакетПредложений->Предложения->Предложение);
        }
        
        return true;
    }
    
    private function parseCategories($categories) {
        foreach ($categories as $category) {
            $categoryData = [
                'id' => (string)$category->Ид,
                'name' => (string)$category->Наименование,
                'parent_id' => null
            ];
            
            $this->log("Processing category: " . $categoryData['name']);
            
            // Save category to database via API
            $this->saveCategory($categoryData);
            
            // Parse subcategories recursively
            if (isset($category->Группы->Группа)) {
                $this->parseSubcategories($category->Группы->Группа, $categoryData['id']);
            }
        }
    }
    
    private function parseSubcategories($subcategories, $parentId) {
        foreach ($subcategories as $subcategory) {
            $categoryData = [
                'id' => (string)$subcategory->Ид,
                'name' => (string)$subcategory->Наименование,
                'parent_id' => $parentId
            ];
            
            $this->log("Processing subcategory: " . $categoryData['name']);
            $this->saveCategory($categoryData);
            
            // Recursive parsing for nested subcategories
            if (isset($subcategory->Группы->Группа)) {
                $this->parseSubcategories($subcategory->Группы->Группа, $categoryData['id']);
            }
        }
    }
    
    private function parseProducts($products) {
        foreach ($products as $product) {
            $productData = [
                'id' => (string)$product->Ид,
                'name' => (string)$product->Наименование,
                'sku' => (string)$product->Артикул,
                'description' => (string)$product->Описание,
                'category_id' => isset($product->Группы->Ид) ? (string)$product->Группы->Ид : null,
                'properties' => []
            ];
            
            // Parse properties
            if (isset($product->ЗначенияСвойств->ЗначенияСвойства)) {
                foreach ($product->ЗначенияСвойств->ЗначенияСвойства as $property) {
                    $productData['properties'][(string)$property->Ид] = (string)$property->Значение;
                }
            }
            
            $this->log("Processing product: " . $productData['name']);
            $this->saveProduct($productData);
        }
    }
    
    private function parseOffers($offers) {
        foreach ($offers as $offer) {
            $offerData = [
                'id' => (string)$offer->Ид,
                'product_id' => (string)$offer->Ид, // Usually same as product ID
                'price' => 0,
                'stock_quantity' => 0
            ];
            
            // Parse prices
            if (isset($offer->Цены->Цена)) {
                foreach ($offer->Цены->Цена as $price) {
                    if ((string)$price->ИдТипаЦены === 'Основная') {
                        $offerData['price'] = (float)$price->ЦенаЗаЕдиницу;
                        break;
                    }
                }
            }
            
            // Parse stock
            if (isset($offer->Остатки->Остаток)) {
                foreach ($offer->Остатки->Остаток as $stock) {
                    $offerData['stock_quantity'] += (int)$stock->Количество;
                }
            }
            
            $this->log("Processing offer for product: " . $offerData['product_id'] . 
                      " (Price: " . $offerData['price'] . ", Stock: " . $offerData['stock_quantity'] . ")");
            
            $this->updateProductOffer($offerData);
        }
    }
    
    private function saveCategory($categoryData) {
        // Call your API to save category
        $this->callAPI('/api/1c/categories', 'POST', $categoryData);
    }
    
    private function saveProduct($productData) {
        // Call your API to save product
        $this->callAPI('/api/1c/products', 'POST', $productData);
    }
    
    private function updateProductOffer($offerData) {
        // Call your API to update product prices and stock
        $this->callAPI('/api/1c/offers', 'POST', $offerData);
    }
    
    private function callAPI($endpoint, $method = 'GET', $data = null) {
        $url = 'http://localhost:3000' . $endpoint; // Adjust URL as needed
        
        $options = [
            'http' => [
                'method' => $method,
                'header' => [
                    'Content-Type: application/json',
                    'User-Agent: 1C-Exchange/1.0'
                ]
            ]
        ];
        
        if ($data && in_array($method, ['POST', 'PUT'])) {
            $options['http']['content'] = json_encode($data);
        }
        
        $context = stream_context_create($options);
        $result = @file_get_contents($url, false, $context);
        
        if ($result === false) {
            $this->log("API call failed: $method $endpoint");
            return false;
        }
        
        return json_decode($result, true);
    }
    
    private function isAllowedIP() {
        $clientIP = $_SERVER['REMOTE_ADDR'];
        // For development, allow all IPs
        return true;
        // return in_array($clientIP, $this->allowedIPs);
    }
    
    private function log($message) {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[$timestamp] $message\n";
        file_put_contents($this->logFile, $logMessage, FILE_APPEND | LOCK_EX);
    }
}

// Handle the request
$handler = new CommerceML2Handler();
$handler->handleRequest();
?>
