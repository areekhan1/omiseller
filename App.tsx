import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Package, 
  FileText, 
  Mail, 
  Calculator, 
  Download, 
  Mic, 
  TrendingUp, 
  Target, 
  Menu, 
  X,
  ChevronRight,
  ExternalLink,
  Copy,
  CheckCircle2,
  Check,
  Loader2,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Globe,
  Bell,
  User,
  Moon,
  Sun,
  Filter,
  Star,
  MapPin,
  Phone,
  Info,
  ArrowUpRight,
  Zap,
  MessageSquare,
  Plus,
  Minus,
  MessageCircle,
  Sparkles,
  Award,
  Rocket,
  Compass,
  Image as ImageIcon,
  Type,
  Key,
  ShieldAlert,
  Map,
  Lightbulb,
  LineChart,
  BrainCircuit,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as XLSX from 'xlsx';
import { 
  Market, 
  Product, 
  SourcingOption, 
  ProductListing, 
  SupplierEmail, 
  Module,
  Marketplace
} from './types';
import { 
  huntProducts, 
  findSourcing, 
  generateListing, 
  generateSupplierEmail, 
  detectTrends,
  analyzeCompetition,
  detectMarketGaps,
  runAutoResearch,
  chatWithAssistant,
  calculateSuccessScore,
  generateLaunchStrategy,
  findNiches,
  analyzeListingImage,
  optimizeTitle,
  findKeywordOpportunities,
  detectFakeReviews,
  generateProductImprovements,
  predictSalesForecast,
  generateDemandHeatmap
} from './services/geminiService';

import { 
  AIActivityFeed, 
  TopOpportunityWidget, 
  AnalyticsChart, 
  PerformanceMetrics, 
  OpportunityRadar, 
  AIInsightsSummary 
} from './components/DashboardEnhancements';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>("Product Hunting");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  const [voiceContext, setVoiceContext] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [sourcingOptions, setSourcingOptions] = useState<SourcingOption[]>([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace>(Marketplace.AMAZON);
  const [listing, setListing] = useState<ProductListing | null>(null);
  const [email, setEmail] = useState<SupplierEmail | null>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [competitionData, setCompetitionData] = useState<any | null>(null);
  const [autoResearchData, setAutoResearchData] = useState<any | null>(null);
  const [marketGaps, setMarketGaps] = useState<Product[]>([]);
  const [successScore, setSuccessScore] = useState<any>(null);
  const [launchStrategy, setLaunchStrategy] = useState<any>(null);
  const [niches, setNiches] = useState<any[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [optimizedTitle, setOptimizedTitle] = useState<any>(null);
  const [keywordOpportunities, setKeywordOpportunities] = useState<any[]>([]);
  const [fakeReviewAnalysis, setFakeReviewAnalysis] = useState<any>(null);
  const [productImprovements, setProductImprovements] = useState<any[]>([]);
  const [salesForecast, setSalesForecast] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Electronics");
  const [titleToOptimize, setTitleToOptimize] = useState("");
  const [reviewsToAnalyze, setReviewsToAnalyze] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<Market>(Market.USA);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [history, setHistory] = useState<{ products: Product[], listings: any[] }>({ products: [], listings: [] });
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SourcingOption | null>(null);
  const [autoHunterProducts, setAutoHunterProducts] = useState<any[]>([]);
  const [isAutoHunting, setIsAutoHunting] = useState(false);
  const [businessInsights, setBusinessInsights] = useState<{
    marketTrend: 'Green' | 'Yellow' | 'Red';
    competitionRisk: 'Green' | 'Yellow' | 'Red';
    profitPotential: 'Green' | 'Yellow' | 'Red';
    launchDifficulty: 'Green' | 'Yellow' | 'Red';
  } | null>(null);
  const [opportunityAlerts, setOpportunityAlerts] = useState<{ title: string; description: string; roi: string }[]>([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantWidth, setAssistantWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 320 && newWidth < window.innerWidth * 0.7) {
        setAssistantWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isResizing]);

  const [isAssistantListening, setIsAssistantListening] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Hello! 👋 I'm OmniSeller AI, your intelligent e-commerce business partner. How can I help you grow your business today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [calcInputs, setCalcInputs] = useState({
    sellingPrice: 0,
    productCost: 0,
    amazonFees: 0,
    shippingCost: 0
  });
  const [showToast, setShowToast] = useState(false);

  const profit = calcInputs.sellingPrice - calcInputs.productCost - calcInputs.amazonFees - calcInputs.shippingCost;
  const roi = calcInputs.productCost > 0 ? (profit / calcInputs.productCost) * 100 : 0;
  const margin = calcInputs.sellingPrice > 0 ? (profit / calcInputs.sellingPrice) * 100 : 0;

  const handleChatSubmit = async (e?: React.FormEvent, text?: string) => {
    if (e) e.preventDefault();
    const messageText = text || chatInput;
    if (!messageText.trim()) return;

    setChatMessages(prev => [...prev, { role: 'user', text: messageText }]);
    setChatInput("");

    try {
      const response = await chatWithAssistant(messageText, chatMessages, selectedMarketplace);
      
      setChatMessages(prev => [...prev, { role: 'ai', text: response.text }]);
      speak(response.text);

      if (response.insights) {
        setBusinessInsights(response.insights);
      }
      if (response.alerts) {
        setOpportunityAlerts(prev => [...response.alerts, ...prev].slice(0, 5));
      }

      if (response.intent) {
        switch (response.intent) {
          case "HUNT":
            setActiveModule("Product Hunting");
            if (response.data?.productName) {
              setSearchQuery(response.data.productName);
              handleHunt(response.data.productName);
            }
            break;
          case "SOURCE":
            setActiveModule("Product Sourcing");
            if (response.data?.productName) {
              setSearchQuery(response.data.productName);
              handleSource(response.data.productName);
            }
            break;
          case "LISTING":
            setActiveModule("Listing Generator");
            break;
          case "EMAIL":
            setActiveModule("Contact Dashboard");
            break;
          case "AUTO_HUNTER":
            setActiveModule("Dashboard");
            break;
          case "DASHBOARD":
            setActiveModule("Dashboard");
            break;
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const fallback = "I'm sorry, I'm having trouble processing that right now. How else can I help?";
      setChatMessages(prev => [...prev, { role: 'ai', text: fallback }]);
      speak(fallback);
    }
  };

  useEffect(() => {
    if (isAssistantOpen && chatMessages.length === 1) {
      const welcome = "Hello! 👋 I'm your OmniSeller AI business partner. I'm already analyzing the market for the best opportunities. How can I help you grow today?";
      speak(welcome);
      
      // Proactive initial analysis
      const runInitialAnalysis = async () => {
        try {
          const response = await chatWithAssistant("Give me a quick market overview and some trending opportunities.", [], selectedMarketplace);
          if (response.insights) setBusinessInsights(response.insights);
          if (response.alerts) setOpportunityAlerts(response.alerts);
        } catch (error) {
          console.error("Initial analysis error:", error);
        }
      };
      runInitialAnalysis();
    }
  }, [isAssistantOpen]);

  const [filters, setFilters] = useState({
    priceRange: [0, 100],
    minMOQ: 0,
    minRating: 0
  });

  // Dark Mode Toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch History on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [prodRes, listRes] = await Promise.all([
          fetch("/api/products").then(r => r.json()),
          fetch("/api/listings").then(r => r.json())
        ]);
        setHistory({ products: prodRes, listings: listRes });
      } catch (e) {
        console.error("Failed to fetch history", e);
      }
    };
    fetchHistory();
  }, []);

  // Speech Synthesis
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    setIsAssistantSpeaking(true);
    utterance.onend = () => {
      setIsAssistantSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => setIsAssistantSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setVoiceMessage(text);
  }, []);

  const startAssistantVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsAssistantListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
      handleChatSubmit(undefined, transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsAssistantListening(false);
    };

    recognition.onend = () => {
      setIsAssistantListening(false);
    };

    recognition.start();
  };

  // Voice Recognition Setup
  const startVoiceCommand = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = true;

    const handleCommand = async (transcript: string) => {
      setVoiceTranscript(transcript);
      const cmd = transcript.toLowerCase();
      
      setIsVoiceProcessing(true);

      // Greeting
      if (cmd === "hello" || cmd === "hi") {
        speak("Hello! I'm OmniSeller AI, how can I help you today?", () => {
          startVoiceCommand(); // Listen again
        });
        setIsVoiceProcessing(false);
        return;
      }

      // Contextual flow for Product Hunting
      if (voiceContext === "awaiting_hunt_niche") {
        setVoiceContext(null);
        speak(`Great choice. I am searching profitable ${cmd} products now.`, () => {
          setIsListening(false);
          setActiveModule("Product Hunting");
          handleHunt(cmd);
        });
        setIsVoiceProcessing(false);
        return;
      }

      // Contextual flow for Sourcing
      if (voiceContext === "awaiting_source_niche") {
        setVoiceContext(null);
        speak(`Searching best suppliers for ${cmd} in the global market.`, () => {
          setIsListening(false);
          setActiveModule("Product Sourcing");
          handleSource(cmd);
        });
        setIsVoiceProcessing(false);
        return;
      }

      // Main commands
      if (cmd.includes("product hunting") || cmd.includes("find products")) {
        setVoiceContext("awaiting_hunt_niche");
        speak("Great. Please tell me the product name or niche you want to search.", () => {
          startVoiceCommand();
        });
      } else if (cmd.includes("sourcing") || cmd.includes("find suppliers") || cmd.includes("search suppliers")) {
        setVoiceContext("awaiting_source_niche");
        speak("Sure. Which product would you like to find suppliers for?", () => {
          startVoiceCommand();
        });
      } else if (cmd.includes("listing") || cmd.includes("generate listing")) {
        speak("Opening Listing Generator. Please provide the product title.", () => {
          setIsListening(false);
          setActiveModule("Listing Generator");
        });
      } else if (cmd.includes("email") || cmd.includes("write email")) {
        speak("Opening Contact Dashboard.", () => {
          setIsListening(false);
          setActiveModule("Contact Dashboard");
        });
      } else if (cmd.includes("calculator") || cmd.includes("profit")) {
        speak("Opening Profit Calculator.", () => {
          setIsListening(false);
          setActiveModule("Profit Calculator");
        });
      } else if (cmd.includes("trend") || cmd.includes("trending")) {
        speak("Opening Trend Detector. Analyzing current market trends.", () => {
          setIsListening(false);
          setActiveModule("Trend Detector");
          handleFetchTrends();
        });
      } else if (cmd.includes("competition") || cmd.includes("analyze")) {
        speak("Opening Competition Analyzer.", () => {
          setIsListening(false);
          setActiveModule("Competition Analyzer");
        });
      } else if (cmd.includes("history") || cmd.includes("saved")) {
        speak("Opening your history.", () => {
          setIsListening(false);
          setActiveModule("History");
        });
      } else if (cmd.includes("auto research") || cmd.includes("autonomous mode")) {
        speak("Activating Autonomous Research Mode. Analyzing market opportunities now.", () => {
          setIsListening(false);
          setActiveModule("Auto Research Mode");
          handleAutoResearch();
        });
      } else if (cmd.includes("market gap") || cmd.includes("gap detector")) {
        speak("Activating Market Gap Detector. Finding high-demand, low-competition opportunities.", () => {
          setIsListening(false);
          setActiveModule("Market Gap Detector");
          handleMarketGapDetection();
        });
      } else {
        speak("Sorry, I did not understand that. Could you please repeat your request?", () => {
          startVoiceCommand();
        });
      }
      setIsVoiceProcessing(false);
    };

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceTranscript("");
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceTranscript(transcript);
      if (event.results[0].isFinal) {
        handleCommand(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [speak, voiceContext]);

  // Initial Greeting when clicking the button
  const toggleVoiceAssistant = () => {
    if (isListening) {
      window.speechSynthesis.cancel();
      setIsListening(false);
      setVoiceContext(null);
    } else {
      speak("Hello! I'm OmniSeller AI, your intelligent business partner. How can I help you today?", () => {
        startVoiceCommand();
      });
    }
  };

  // Data Handlers
  const handleHunt = async (niche?: string) => {
    setLoading(true);
    const query = niche || searchQuery;
    try {
      const results = await huntProducts(selectedMarket, query, selectedMarketplace);
      setProducts(results);
      
      // Persist to backend
      for (const p of results) {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p)
        });
      }
      // Refresh history
      const prodRes = await fetch("/api/products").then(r => r.json());
      setHistory(prev => ({ ...prev, products: prodRes }));
      
      if (isListening) {
        speak(`I found ${results.length} profitable products for you. I've highlighted the best opportunities with AI insights. Would you like me to find suppliers for the most profitable one?`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSource = async (name?: string, image?: string) => {
    setLoading(true);
    const query = name || searchQuery;
    try {
      const results = await findSourcing(query, image, selectedMarketplace);
      setSourcingOptions(results);
      setActiveModule("Product Sourcing");
      
      if (isListening) {
        const bestRoi = Math.max(...results.map(s => s.roi));
        speak(`Suppliers found successfully for ${query}. I found a sourcing option with ${bestRoi}% ROI. I've also provided AI business suggestions for these options. Would you like to generate a listing for this product?`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateListing = async () => {
    setLoading(true);
    try {
      const result = await generateListing(searchQuery, ["trending", "high quality", "optimized"], selectedMarketplace);
      setListing(result);
      
      // Persist to backend
      await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: searchQuery, content: result })
      });
      // Refresh history
      const listRes = await fetch("/api/listings").then(r => r.json());
      setHistory(prev => ({ ...prev, listings: listRes }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCompetition = async () => {
    setLoading(true);
    try {
      const result = await analyzeCompetition(searchQuery, selectedMarket, selectedMarketplace);
      setCompetitionData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmail = async (type: string, supplierName?: string) => {
    setLoading(true);
    setActiveModule("Contact Dashboard");
    if (supplierName) setSearchQuery(supplierName);
    try {
      const result = await generateSupplierEmail(type, supplierName || searchQuery);
      setEmail(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTrends = async () => {
    setLoading(true);
    try {
      const result = await detectTrends(selectedMarketplace);
      setTrends(result);
      if (isListening) {
        speak(`I've analyzed the current market trends. There are ${result.length} growing niches you should consider.`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoResearch = async () => {
    setLoading(true);
    try {
      const result = await runAutoResearch(selectedMarket, selectedMarketplace);
      setAutoResearchData(result);
      setActiveModule("Auto Research Mode");
      if (isListening) {
        speak(`Autonomous research complete. I found a great opportunity: ${result.product.name}. I've also identified 3 suppliers and calculated a potential ROI of up to ${Math.max(...result.suppliers.map((s: any) => s.roi))}%`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarketGapDetection = async () => {
    setLoading(true);
    try {
      const results = await detectMarketGaps(selectedMarket, selectedMarketplace);
      setMarketGaps(results);
      setActiveModule("Market Gap Detector");
      if (isListening) {
        speak(`I've identified ${results.length} high-demand, low-competition market gaps for you.`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateAutoHunterProducts = async () => {
    setIsAutoHunting(true);
    try {
      // Simulating AI generation for 5 products
      await new Promise(resolve => setTimeout(resolve, 1500));
      const ideas = [
        { name: "Ergonomic Desk Footrest", category: "Office Products", demand: "High", competition: "Low", roi: "135%", trend: "Rising 📈", score: 92 },
        { name: "Collapsible Silicone Food Containers", category: "Kitchen & Dining", demand: "Very High", competition: "Medium", roi: "110%", trend: "Stable 📊", score: 85 },
        { name: "UV Phone Sanitizer Box", category: "Electronics", demand: "High", competition: "Medium", roi: "150%", trend: "Rising 📈", score: 88 },
        { name: "Biodegradable Bamboo Toothbrushes", category: "Personal Care", demand: "High", competition: "Low", roi: "180%", trend: "Exploding 🔥", score: 95 },
        { name: "Smart Reusable Notebook", category: "Stationery", demand: "Medium", competition: "Low", roi: "125%", trend: "Rising 📈", score: 82 }
      ];
      setAutoHunterProducts(ideas);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAutoHunting(false);
    }
  };

  useEffect(() => {
    if (autoHunterProducts.length === 0) {
      generateAutoHunterProducts();
    }
  }, []);

  const handleAnalyzeSuccessScore = async (productName: string) => {
    setLoading(true);
    try {
      const score = await calculateSuccessScore(productName, selectedMarketplace);
      setSuccessScore(score);
    } catch (error) {
      console.error("Error calculating success score:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLaunchStrategy = async (productName: string) => {
    setLoading(true);
    try {
      const strategy = await generateLaunchStrategy(productName, selectedMarketplace);
      setLaunchStrategy(strategy);
    } catch (error) {
      console.error("Error generating launch strategy:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFindNiches = async (category: string) => {
    setLoading(true);
    try {
      const nicheList = await findNiches(category);
      setNiches(nicheList);
    } catch (error) {
      console.error("Error finding niches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeTitle = async (title: string) => {
    setLoading(true);
    try {
      const optimized = await optimizeTitle(title, selectedMarketplace);
      setOptimizedTitle(optimized);
    } catch (error) {
      console.error("Error optimizing title:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFindKeywordOpportunities = async (productName: string) => {
    setLoading(true);
    try {
      const keywords = await findKeywordOpportunities(productName, selectedMarketplace);
      setKeywordOpportunities(keywords);
    } catch (error) {
      console.error("Error finding keywords:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectFakeReviews = async (reviews: string) => {
    setLoading(true);
    try {
      const analysis = await detectFakeReviews(reviews);
      setFakeReviewAnalysis(analysis);
    } catch (error) {
      console.error("Error detecting fake reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImprovements = async (productName: string) => {
    setLoading(true);
    try {
      const improvements = await generateProductImprovements(productName);
      setProductImprovements(improvements);
    } catch (error) {
      console.error("Error generating improvements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictSales = async (productName: string) => {
    setLoading(true);
    try {
      const forecast = await predictSalesForecast(productName);
      setSalesForecast(forecast);
    } catch (error) {
      console.error("Error predicting sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHeatmap = async (query: string) => {
    setLoading(true);
    try {
      const data = await generateDemandHeatmap(query);
      setHeatmapData(data);
    } catch (error) {
      console.error("Error generating heatmap:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const analysis = await analyzeListingImage(base64String, selectedMarketplace);
        setImageAnalysis(analysis);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setLoading(false);
    }
  };

  const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setShowToast(true);
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 2000);
  };

  const navItems = {
    research: [
      { name: "Dashboard", icon: LayoutDashboard },
      { name: "Auto Research Mode", icon: Zap },
      { name: "Product Hunting", icon: Search },
      { name: "Product Sourcing", icon: Package },
      { name: "Sourcing Finder", icon: Target },
      { name: "Market Gap Detector", icon: BarChart3 },
      { name: "Trend Detector", icon: TrendingUp },
    ],
    operations: [
      { name: "Listing Generator", icon: FileText },
      { name: "Contact Dashboard", icon: Mail },
      { name: "Competition Analyzer", icon: BarChart3 },
      { name: "Profit Calculator", icon: Calculator },
    ],
    system: [
      { name: "History", icon: History },
      { name: "Export Data", icon: Download },
    ],
    intelligence: [
      { name: "AI Product Success Score", icon: Award },
      { name: "AI Launch Strategy", icon: Rocket },
      { name: "AI Niche Finder", icon: Compass },
      { name: "AI Image Analyzer", icon: ImageIcon },
      { name: "AI Title Optimizer", icon: Type },
      { name: "AI Keyword Finder", icon: Key },
      { name: "AI Fake Review Detector", icon: ShieldAlert },
      { name: "AI Demand Heatmap", icon: Map },
      { name: "AI Improvement Generator", icon: Lightbulb },
      { name: "AI Sales Forecast", icon: LineChart },
    ]
  };

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const getTrendingItems = () => [
    { type: 'product', label: "Portable Blender", icon: Zap },
    { type: 'product', label: "Eco-Friendly Yoga Mat", icon: Target },
    { type: 'niche', label: "Pet Health Tech", icon: TrendingUp },
  ];

  const getRecentSearches = () => history.products.slice(0, 3).map(p => ({
    type: 'history',
    label: p.name,
    icon: Search
  }));

  const handleSearchCommit = (value: string) => {
    setSearchQuery(value);
    handleHunt(value);
    setShowSearchSuggestions(false);
    setIsSearchFocused(false);
  };

  const stats = [
    { label: "Products Found", value: history.products.length, icon: ShoppingCart, color: "text-sky-500", bg: "bg-sky-500/10" },
    { label: "Profitable Products", value: history.products.filter(p => p.profit > 10).length, icon: DollarSign, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Suppliers Found", value: 89, icon: Package, color: "text-sky-500", bg: "bg-sky-500/10" },
    { label: "Avg ROI", value: "112%", icon: TrendingUp, color: "text-sky-400", bg: "bg-sky-400/10" },
  ];

  return (
    <div className="flex h-screen bg-[#0f172a] text-gray-100 font-sans selection:bg-sky-100 transition-colors duration-300">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="sidebar-gradient flex flex-col relative z-20 shadow-[10px_0_30px_rgba(0,168,225,0.05)] border-r border-sky-500/10"
      >
        <div className="p-8 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            {isSidebarOpen ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 font-black text-2xl tracking-tighter text-white group cursor-pointer"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-sky-500/30 rounded-full blur-xl group-hover:bg-sky-500/50 transition-all" />
                  <Zap className="w-9 h-9 fill-white relative z-10 drop-shadow-lg" />
                </div>
                <span className="drop-shadow-md text-gradient">Omiseller</span>
              </motion.div>
            ) : (
              <div className="relative group cursor-pointer mx-auto">
                <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-lg group-hover:bg-sky-500/40 transition-all" />
                <Zap className="w-9 h-9 text-white relative z-10" />
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[9px] font-black text-white/30 uppercase tracking-[0.15em] pl-12 leading-none"
            >
              AI Powered e-Commerce Intelligence
            </motion.p>
          )}
        </div>

        <nav className="flex-1 px-2 space-y-6 overflow-y-auto py-4 sidebar-scrollbar">
          <div>
            {isSidebarOpen && <p className="px-6 text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 mt-2">Research Tools</p>}
            <div className="space-y-2 px-2">
              {navItems.research.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveModule(item.name as Module)}
                  className={cn(
                    "sidebar-item w-full group",
                    activeModule === item.name && "active"
                  )}
                >
                  <item.icon className={cn(
                    "w-6 h-6 shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                    activeModule === item.name ? "text-white" : "text-white/50 group-hover:text-white"
                  )} />
                  {isSidebarOpen && <span className="font-bold text-sm whitespace-nowrap tracking-tight">{item.name}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            {isSidebarOpen && <p className="px-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 mt-2">Operations</p>}
            <div className="space-y-2 px-2">
              {navItems.operations.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveModule(item.name as Module)}
                  className={cn(
                    "sidebar-item w-full group",
                    activeModule === item.name && "active"
                  )}
                >
                  <item.icon className={cn(
                    "w-6 h-6 shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                    activeModule === item.name ? "text-white" : "text-white/50 group-hover:text-white"
                  )} />
                  {isSidebarOpen && <span className="font-bold text-sm whitespace-nowrap tracking-tight">{item.name}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            {isSidebarOpen && <p className="px-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 mt-2">AI Intelligence</p>}
            <div className="space-y-2 px-2">
              {navItems.intelligence.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveModule(item.name as Module)}
                  className={cn(
                    "sidebar-item w-full group",
                    activeModule === item.name && "active"
                  )}
                >
                  <item.icon className={cn(
                    "w-6 h-6 shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                    activeModule === item.name ? "text-white" : "text-white/50 group-hover:text-white"
                  )} />
                  {isSidebarOpen && <span className="font-bold text-sm whitespace-nowrap tracking-tight">{item.name}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="space-y-2 px-2">
              {navItems.system.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveModule(item.name as Module)}
                  className={cn(
                    "sidebar-item w-full group",
                    activeModule === item.name && "active"
                  )}
                >
                  <item.icon className={cn(
                    "w-6 h-6 shrink-0 transition-all duration-500 group-hover:scale-110",
                    activeModule === item.name ? "text-white" : "text-white/50 group-hover:text-white"
                  )} />
                  {isSidebarOpen && <span className="font-bold text-sm whitespace-nowrap tracking-tight">{item.name}</span>}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex-1 flex items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-white/50 hover:text-white shadow-inner"
            >
              {isSidebarOpen ? <Menu className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="flex-1 flex items-center justify-center p-3 rounded-2xl bg-white/5 text-white/50 hover:bg-white/10 transition-all shadow-inner"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          
          <button 
            onClick={toggleVoiceAssistant}
            title="Click to talk with your Omiseller AI assistant"
            className={cn(
              "w-full flex items-center justify-center gap-3 p-4 rounded-full transition-all duration-500 relative overflow-hidden group shadow-xl",
              isListening 
                ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/40" 
                : "bg-gradient-to-r from-white/20 to-white/10 text-white hover:from-white/30 hover:to-white/20 backdrop-blur-md border border-white/10"
            )}
          >
            {isListening && (
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white/20 rounded-full"
              />
            )}
            <Mic className={cn("w-5 h-5 relative z-10 transition-transform group-hover:scale-110", isListening && "animate-bounce")} />
            {isSidebarOpen && <span className="font-bold text-sm relative z-10 tracking-tight">{isListening ? "Listening..." : "Voice Assistant"}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#0f172a]">
          <header className="h-24 bg-[#0f172a]/80 backdrop-blur-3xl border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-50">
          {/* 1. Large Premium Search Bar (Left) */}
          <div className="flex-1 flex max-w-2xl">
            <div className="relative w-full group">
              {/* Animation Layer */}
              <motion.div 
                animate={{ 
                  scale: isSearchFocused ? 1.02 : 1,
                  opacity: isSearchFocused ? 1 : 0.4
                }}
                className={cn(
                  "absolute inset-0 bg-sky-500/10 rounded-full blur-xl transition-all duration-500",
                  isSearchFocused ? "opacity-100" : "opacity-0 group-hover:opacity-30"
                )}
              />
              
              <div className={cn(
                "relative flex items-center bg-[#131c31] border transition-all duration-300 rounded-full overflow-hidden",
                isSearchFocused 
                  ? "border-sky-500/40 ring-4 ring-sky-500/5 bg-[#16213a]" 
                  : "border-white/5 hover:border-white/10"
              )}>
                <Search className={cn(
                  "ml-6 w-5 h-5 transition-colors duration-300",
                  isSearchFocused ? "text-sky-500" : "text-gray-500"
                )} />
                
                <input 
                  type="text"
                  placeholder="Search products, suppliers, or niches..."
                  className="flex-1 px-4 py-4 bg-transparent border-none outline-none text-white font-bold placeholder:text-gray-500 text-sm tracking-tight"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleHunt(searchQuery);
                  }}
                />
              </div>
            </div>
          </div>

          {/* 2-6. Right Side Tools & Profile */}
          <div className="flex items-center gap-5 ml-8 shrink-0">
            
            {/* 2. Separate Marketplace Dropdown (Restored Functionality) */}
            <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-2xl border border-white/5 hover:border-sky-500/30 transition-colors group shrink-0">
              <Package className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-sky-500/50 uppercase tracking-widest leading-none mb-1">Platform</span>
                <select 
                  value={selectedMarketplace}
                  onChange={(e) => setSelectedMarketplace(e.target.value as Marketplace)}
                  className="bg-transparent border-none p-0 text-[10px] font-black uppercase tracking-widest text-gray-200 focus:ring-0 cursor-pointer outline-none min-w-[110px]"
                >
                  {Object.values(Marketplace).map(m => (
                    <option key={m} value={m} className="bg-[#0f172a]">{m.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Separate Country Dropdown (Restored Functionality) */}
            <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-2xl border border-white/5 hover:border-sky-400/30 transition-colors group shrink-0">
              <Globe className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-sky-400/50 uppercase tracking-widest leading-none mb-1">Market</span>
                <select 
                  value={selectedMarket}
                  onChange={(e) => setSelectedMarket(e.target.value as Market)}
                  className="bg-transparent border-none p-0 text-[10px] font-black uppercase tracking-widest text-gray-200 focus:ring-0 cursor-pointer outline-none"
                >
                  {Object.values(Market).map(m => <option key={m} value={m} className="bg-[#0f172a]">{m}</option>)}
                </select>
              </div>
            </div>
            
            {/* 4. Calculator Icon */}
            <button 
              onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
              className={cn(
                "p-3 rounded-2xl transition-all group relative border shadow-sm shrink-0",
                isCalculatorOpen ? "bg-sky-500/10 text-sky-500 border-sky-500/20" : "text-gray-500 border-white/5 hover:text-sky-500 hover:bg-sky-500/10 hover:border-sky-500/20"
              )}
              title="Profit Calculator"
            >
              <Calculator className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>

            {/* 5. Notification Icon */}
            <button className="relative p-3 text-gray-500 hover:text-sky-500 hover:bg-sky-500/10 border border-white/5 hover:border-sky-500/20 rounded-2xl transition-all group shrink-0">
              <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0f172a] shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            </button>

            {/* 6. Profile Section - Layout Fixed */}
            <div className="flex items-center gap-4 pl-6 border-l border-white/10 shrink-0 pr-2">
              <div className="text-right hidden xl:block shrink-0">
                <p className="text-sm font-black text-white tracking-tight leading-none whitespace-nowrap mb-1">Nayab Goher</p>
                <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest opacity-80 whitespace-nowrap">Pro Seller Account</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20 hover:scale-105 transition-transform cursor-pointer border border-white/10 shrink-0 group">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 scroll-smooth">
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2 relative"
          >
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full animate-pulse" />
            <h1 className="text-5xl font-black text-white tracking-tight relative z-10 flex items-center gap-4">
              <span className="text-gradient">Welcome back, Nayab</span> 
              <motion.span
                animate={{ rotate: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👋
              </motion.span>
            </h1>
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-px w-12 bg-sky-500/50" />
              <p className="text-gray-400 font-medium text-lg tracking-tight">
                Omiseller AI agent ready to help me discover <span className="text-sky-400 font-bold">profitable opportunities</span> today.
              </p>
            </div>
          </motion.div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="premium-card p-8 group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/10 to-transparent rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className={cn("w-16 h-16 glow-icon shadow-lg", stat.bg)}>
                    <stat.icon className={cn("w-8 h-8", stat.color)} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-sky-500 bg-sky-500/10 px-2 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1 border border-sky-500/10">
                      <TrendingUp className="w-3 h-3" /> +12.5%
                    </span>
                  </div>
                </div>

                <div className="relative z-10 mt-4">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-black text-white tracking-tighter">
                      {typeof stat.value === 'number' ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {stat.value}
                        </motion.span>
                      ) : stat.value}
                    </p>
                    {stat.label === "Avg ROI" && <span className="text-sky-500 font-black text-xl">%</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Insights Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 blur-[100px] rounded-full -mr-48 -mt-48 animate-pulse" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                    <BrainCircuit className="w-6 h-6 text-sky-500" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">AI Intelligence Insights</h2>
                </div>
                <p className="text-gray-400 font-medium">Real-time analysis of your {selectedMarketplace} business performance.</p>
              </div>
              <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all flex items-center gap-2 group">
                View Full Report <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {[
                { label: "Products Analyzed", value: "1,284", icon: Search, color: "text-amber-500" },
                { label: "Profitable Gaps", value: "12", icon: Target, color: "text-emerald-500" },
                { label: "Best Niche", value: "Home Decor", icon: Compass, color: "text-sky-500" },
                { label: "Highest ROI", value: "248%", icon: TrendingUp, color: "text-indigo-500" }
              ].map((insight, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-all group/insight">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover/insight:scale-110", insight.color)}>
                      <insight.icon className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{insight.label}</p>
                  </div>
                  <p className="text-2xl font-black text-white tracking-tight">{insight.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeModule === "AI Improvement Generator" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10 text-center">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white">AI Product Improvement Generator</h2>
                        <p className="text-gray-500 font-medium">Get actionable suggestions to outperform your competitors.</p>
                      </div>
                      <div className="flex gap-4">
                        <input 
                          type="text"
                          placeholder="Enter Competitor Product Name"
                          className="flex-1 px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold transition-all"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                          onClick={() => handleGenerateImprovements(searchQuery)}
                          disabled={loading || !searchQuery}
                          className="bg-sky-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-sky-700 transition-all disabled:opacity-50 shadow-xl shadow-sky-500/20"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Generate Improvements"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {productImprovements.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {productImprovements.map((improvement, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5 space-y-6 group hover:border-sky-500/30 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="p-3 bg-amber-500/10 rounded-2xl">
                              <Lightbulb className="w-6 h-6 text-amber-500" />
                            </div>
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              improvement.priority === "High" ? "bg-red-500/10 text-red-400" : "bg-sky-500/10 text-sky-400"
                            )}>
                              {improvement.priority} Priority
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="text-xl font-black text-white group-hover:text-sky-500 transition-colors">{improvement.feature}</h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">{improvement.suggestion}</p>
                          </div>

                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Impact on Sales</p>
                            <p className="text-sm font-black text-emerald-500">{improvement.impact}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeModule === "AI Sales Forecast" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10 text-center">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white">AI Sales Forecast Predictor</h2>
                        <p className="text-gray-500 font-medium">Predict your future sales and revenue with AI-driven forecasting.</p>
                      </div>
                      <div className="flex gap-4">
                        <input 
                          type="text"
                          placeholder="Enter Product Name"
                          className="flex-1 px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold transition-all"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                          onClick={() => handlePredictSales(searchQuery)}
                          disabled={loading || !searchQuery}
                          className="bg-sky-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-sky-700 transition-all disabled:opacity-50 shadow-xl shadow-sky-500/20"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Predict Sales"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {salesForecast.length > 0 && (
                    <div className="space-y-8">
                      <div className="bg-[#1e293b] p-10 rounded-[2.5rem] border border-white/5">
                        <h3 className="text-xl font-black text-white mb-10 flex items-center gap-3">
                          <LineChart className="w-6 h-6 text-sky-500" /> 6-Month Sales Projection
                        </h3>
                        <div className="h-64 flex items-end justify-between gap-4 px-4">
                          {salesForecast.map((data, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                              <div className="relative w-full flex flex-col items-center justify-end h-full">
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${(data.units / Math.max(...salesForecast.map(d => d.units))) * 100}%` }}
                                  transition={{ delay: idx * 0.1, duration: 1 }}
                                  className="w-full max-w-[40px] bg-sky-500/20 border-t-4 border-sky-500 rounded-t-lg group-hover:bg-sky-500/40 transition-all relative"
                                >
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-sky-500 text-white text-[10px] font-black px-2 py-1 rounded whitespace-nowrap">
                                    {data.units} units
                                  </div>
                                </motion.div>
                              </div>
                              <div className="text-center">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">{data.month}</p>
                                <p className="text-[10px] font-black text-emerald-500 mt-1">${data.revenue.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { label: "Total Projected Units", value: salesForecast.reduce((acc, curr) => acc + curr.units, 0).toLocaleString(), icon: Package },
                          { label: "Total Projected Revenue", value: `$${salesForecast.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}`, icon: DollarSign },
                          { label: "Avg Monthly Growth", value: "+8.4%", icon: TrendingUp },
                        ].map((stat, i) => (
                          <div key={i} className="bg-[#1e293b] p-8 rounded-[2rem] border border-white/5 flex items-center gap-6">
                            <div className="p-4 bg-sky-500/10 rounded-2xl">
                              <stat.icon className="w-6 h-6 text-sky-500" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                              <p className="text-2xl font-black text-white">{stat.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeModule === "AI Fake Review Detector" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10 text-center">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white">AI Fake Review Detector</h2>
                        <p className="text-gray-500 font-medium">Verify the authenticity of product reviews with AI analysis.</p>
                      </div>
                      <div className="space-y-4">
                        <textarea 
                          placeholder="Paste product reviews here to analyze for authenticity..."
                          className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold transition-all min-h-[150px] resize-none"
                          value={reviewsToAnalyze}
                          onChange={(e) => setReviewsToAnalyze(e.target.value)}
                        />
                        <button 
                          onClick={() => handleDetectFakeReviews(reviewsToAnalyze)}
                          disabled={loading || !reviewsToAnalyze}
                          className="w-full py-5 bg-sky-600 text-white rounded-[2rem] font-black text-lg hover:bg-sky-700 transition-all disabled:opacity-50 shadow-xl shadow-sky-500/20 flex items-center justify-center gap-3"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><ShieldAlert className="w-6 h-6" /> Analyze Reviews</>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {fakeReviewAnalysis && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                      <div className="bg-[#1e293b] p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-32 h-32 rounded-full border-8 border-white/5 flex items-center justify-center relative">
                          <div className={cn(
                            "absolute inset-0 rounded-full border-8",
                            fakeReviewAnalysis.authenticityScore >= 80 ? "border-emerald-500" : fakeReviewAnalysis.authenticityScore >= 50 ? "border-amber-500" : "border-red-500"
                          )} style={{ clipPath: `inset(0 0 ${100 - fakeReviewAnalysis.authenticityScore}% 0)` }} />
                          <span className="text-4xl font-black text-white">{fakeReviewAnalysis.authenticityScore}%</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Authenticity Score</p>
                          <p className={cn(
                            "text-lg font-black",
                            fakeReviewAnalysis.authenticityScore >= 80 ? "text-emerald-500" : fakeReviewAnalysis.authenticityScore >= 50 ? "text-amber-500" : "text-red-500"
                          )}>
                            {fakeReviewAnalysis.authenticityScore >= 80 ? "Highly Authentic" : fakeReviewAnalysis.authenticityScore >= 50 ? "Suspicious" : "Likely Fake"}
                          </p>
                        </div>
                      </div>

                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-white/5">
                          <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-amber-500" /> Red Flags Detected
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fakeReviewAnalysis.redFlags.map((flag: string, i: number) => (
                              <div key={i} className="flex items-center gap-3 p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                                <X className="w-4 h-4 text-red-500" />
                                <span className="text-xs text-gray-400 font-medium">{flag}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-sky-500/5 p-8 rounded-[2rem] border border-sky-500/10">
                          <h4 className="text-sm font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-sky-500" /> AI Analysis Summary
                          </h4>
                          <p className="text-gray-400 text-sm leading-relaxed font-medium">{fakeReviewAnalysis.reasoning}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {activeModule === "AI Demand Heatmap" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10 text-center">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white">AI Demand Heatmap</h2>
                        <p className="text-gray-500 font-medium">Visualize regional demand and identify untapped geographical markets.</p>
                      </div>
                      <div className="flex gap-4">
                        <input 
                          type="text"
                          placeholder="Enter Product Category or Name"
                          className="flex-1 px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold transition-all"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                          onClick={() => handleGenerateHeatmap(searchQuery)}
                          disabled={loading || !searchQuery}
                          className="bg-sky-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-sky-700 transition-all disabled:opacity-50 shadow-xl shadow-sky-500/20"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Generate Heatmap"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-[#1e293b] p-10 rounded-[2.5rem] border border-white/5 relative h-[500px] overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <Map className="w-full h-full text-sky-500" />
                      </div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-black text-white">Regional Demand Density</h3>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-sky-500 rounded-full" />
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">High</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-sky-500/30 rounded-full" />
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Low</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Stylized Heatmap Dots */}
                        <div className="relative flex-1">
                          {(heatmapData.length > 0 ? heatmapData : [
                            { top: '20%', left: '30%', size: 'w-12 h-12', score: 60 },
                            { top: '40%', left: '60%', size: 'w-20 h-20', score: 80 },
                            { top: '70%', left: '20%', size: 'w-16 h-16', score: 40 },
                            { top: '30%', left: '80%', size: 'w-10 h-10', score: 50 },
                            { top: '60%', left: '50%', size: 'w-24 h-24', score: 90 },
                          ]).map((dot, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className={cn(
                                "absolute rounded-full blur-xl animate-pulse",
                                dot.size || 'w-12 h-12',
                                (dot.score || 50) > 70 ? "bg-sky-500/80" : (dot.score || 50) > 40 ? "bg-sky-500/50" : "bg-sky-500/30"
                              )}
                              style={{ top: dot.top, left: dot.left }}
                            />
                          ))}
                        </div>
                        
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                          <p className="text-xs text-gray-400 font-medium leading-relaxed italic">
                            "Highest demand detected in urban coastal regions. Recommend targeting California, New York, and Florida for initial PPC campaigns."
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                        <h3 className="text-lg font-black text-white">Top Markets</h3>
                        <div className="space-y-4">
                          {(heatmapData.length > 0 ? heatmapData : [
                            { region: "North America", score: 94, trend: "+12%" },
                            { region: "Europe", score: 82, trend: "+5%" },
                            { region: "Asia Pacific", score: 76, trend: "+18%" },
                            { region: "Middle East", score: 45, trend: "-2%" },
                          ]).map((market, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-black text-white">{market.region}</p>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{market.trend || "+5%"} growth</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-black text-sky-500">{market.score}</p>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Score</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-sky-500/10 p-8 rounded-[2.5rem] border border-sky-500/20">
                        <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em] mb-3">AI Insight</p>
                        <p className="text-sm text-sky-200 leading-relaxed font-medium">
                          Emerging demand in the Asia Pacific region suggests a 24% increase in search volume over the next 3 months.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModule === "AI Title Optimizer" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10 text-center">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white">AI Title Optimizer</h2>
                        <p className="text-gray-500 font-medium">Generate high-converting, SEO-optimized Amazon titles.</p>
                      </div>
                      <div className="space-y-4">
                        <textarea 
                          placeholder="Enter your current product title or keywords..."
                          className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold transition-all min-h-[120px] resize-none"
                          value={titleToOptimize}
                          onChange={(e) => setTitleToOptimize(e.target.value)}
                        />
                        <button 
                          onClick={() => handleOptimizeTitle(titleToOptimize)}
                          disabled={loading || !titleToOptimize}
                          className="w-full py-5 bg-sky-600 text-white rounded-[2rem] font-black text-lg hover:bg-sky-700 transition-all disabled:opacity-50 shadow-xl shadow-sky-500/20 flex items-center justify-center gap-3"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Type className="w-6 h-6" /> Optimize Title</>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {optimizedTitle && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-4xl mx-auto space-y-8"
                    >
                      <div className="bg-[#1e293b] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                        <div className="bg-white/5 px-10 py-6 border-b border-white/5 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-sky-500" />
                            <h3 className="text-lg font-black text-white">Optimized Title</h3>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(optimizedTitle.title)}
                            className="px-6 py-2 bg-sky-600 text-white rounded-full text-xs font-black hover:bg-sky-700 transition-all flex items-center gap-2"
                          >
                            <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy Title"}
                          </button>
                        </div>
                        <div className="p-10 space-y-8">
                          <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 text-xl font-black text-white leading-tight">
                            {optimizedTitle.title}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">Included Keywords</p>
                              <div className="flex flex-wrap gap-2">
                                {optimizedTitle.keywordsUsed.map((kw: string, i: number) => (
                                  <span key={i} className="px-3 py-1.5 bg-sky-500/10 text-sky-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-sky-500/10">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-4">
                              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Optimization Strategy</p>
                              <p className="text-sm text-gray-400 font-medium leading-relaxed">{optimizedTitle.reasoning}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {activeModule === "AI Keyword Finder" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10 text-center">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white">AI Keyword Opportunity Finder</h2>
                        <p className="text-gray-500 font-medium">Find high-volume, low-competition keywords for your product.</p>
                      </div>
                      <div className="flex gap-4">
                        <input 
                          type="text"
                          placeholder="Enter Product Name"
                          className="flex-1 px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold transition-all"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                          onClick={() => handleFindKeywordOpportunities(searchQuery)}
                          disabled={loading || !searchQuery}
                          className="bg-sky-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-sky-700 transition-all disabled:opacity-50 shadow-xl shadow-sky-500/20"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Find Keywords"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {keywordOpportunities.length > 0 && (
                    <div className="bg-[#1e293b] rounded-[2.5rem] border border-white/5 overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white/5">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Keyword</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Search Volume</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Competition</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Opp. Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {keywordOpportunities.map((kw, idx) => (
                            <motion.tr 
                              key={idx}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              className="hover:bg-white/[0.02] transition-colors group"
                            >
                              <td className="px-8 py-6">
                                <span className="font-bold text-white group-hover:text-sky-500 transition-colors">{kw.keyword}</span>
                              </td>
                              <td className="px-8 py-6 text-center">
                                <span className="text-gray-400 font-medium">{kw.searchVolume}</span>
                              </td>
                              <td className="px-8 py-6 text-center">
                                <span className={cn(
                                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                  kw.competition === "Low" ? "bg-emerald-500/10 text-emerald-400" : kw.competition === "Medium" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                                )}>
                                  {kw.competition}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <span className="text-sky-500 font-black">{kw.opportunityScore}/100</span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeModule === "AI Niche Finder" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10 text-center">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white">AI Niche Finder</h2>
                        <p className="text-gray-500 font-medium">Discover hidden, high-profit niches with low competition.</p>
                      </div>
                      <div className="flex gap-4">
                        <select 
                          className="flex-1 px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold appearance-none cursor-pointer"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          {["Electronics", "Home & Kitchen", "Beauty", "Sports", "Toys", "Pet Supplies", "Office Products"].map(cat => (
                            <option key={cat} value={cat} className="bg-[#1e293b]">{cat}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => handleFindNiches(selectedCategory)}
                          disabled={loading}
                          className="bg-sky-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-sky-700 transition-all disabled:opacity-50 shadow-xl shadow-sky-500/20"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Find Niches"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {niches.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {niches.map((niche, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5 space-y-6 group hover:border-sky-500/30 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-black text-white group-hover:text-sky-500 transition-colors">{niche.niche}</h3>
                            <div className="p-2 bg-sky-500/10 rounded-xl">
                              <Compass className="w-5 h-5 text-sky-500" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Demand</p>
                              <p className="text-lg font-black text-white">{niche.demand}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Competition</p>
                              <p className="text-lg font-black text-amber-500">{niche.competition}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">Top Keywords</p>
                            <div className="flex flex-wrap gap-2">
                              {niche.keywords.map((kw: string, kIdx: number) => (
                                <span key={kIdx} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest border border-white/5">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Profit Potential</span>
                            <span className="text-emerald-500 font-black">{niche.profitPotential}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeModule === "AI Image Analyzer" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10 text-center">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white">AI Image Analyzer</h2>
                        <p className="text-gray-500 font-medium">Analyze your product images for conversion optimization.</p>
                      </div>
                      <div className="flex flex-col items-center gap-6">
                        <label className="w-full max-w-md h-40 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-sky-500/30 hover:bg-sky-500/5 transition-all group">
                          <ImageIcon className="w-10 h-10 text-gray-500 group-hover:text-sky-500 transition-colors" />
                          <span className="text-sm font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Click to upload product image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        {loading && (
                          <div className="flex items-center gap-3 text-sky-500 font-black text-xs uppercase tracking-widest">
                            <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Image...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {imageAnalysis && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                      <div className="bg-[#1e293b] p-10 rounded-[2.5rem] border border-white/5 space-y-8">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black text-white">Quality Analysis</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-sky-500">{imageAnalysis.qualityScore}</span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">/ 100</span>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          {[
                            { label: "Lighting", value: imageAnalysis.lighting },
                            { label: "Background", value: imageAnalysis.background },
                            { label: "Product Visibility", value: imageAnalysis.productVisibility },
                          ].map((item, idx) => (
                            <div key={idx} className="space-y-3">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-gray-500">{item.label}</span>
                                <span className="text-white">{item.value}</span>
                              </div>
                              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: item.value === "Excellent" ? "100%" : item.value === "Good" ? "75%" : item.value === "Fair" ? "50%" : "25%" }}
                                  className="h-full bg-sky-500 rounded-full"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#1e293b] p-10 rounded-[2.5rem] border border-white/5 space-y-8">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                          <Lightbulb className="w-6 h-6 text-amber-500" /> Improvement Tips
                        </h3>
                        <div className="space-y-4">
                          {imageAnalysis.improvements.map((tip: string, idx: number) => (
                            <div key={idx} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                              <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-amber-500" />
                              </div>
                              <p className="text-sm text-gray-400 font-medium leading-relaxed">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {imageAnalysis.improvedImage && (
                        <div className="lg:col-span-2 bg-[#1e293b] p-10 rounded-[2.5rem] border border-white/5 space-y-8">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-white flex items-center gap-3">
                              <Sparkles className="w-6 h-6 text-sky-500" /> Improved Version
                            </h3>
                            <button 
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = imageAnalysis.improvedImage;
                                link.download = 'improved-product-image.png';
                                link.click();
                              }}
                              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" /> Download Improved Image
                            </button>
                          </div>
                          <div className="relative group cursor-pointer overflow-hidden rounded-2xl border border-white/5 aspect-video bg-black/20 flex items-center justify-center">
                            <img 
                              src={imageAnalysis.improvedImage} 
                              alt="Improved version" 
                              className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = imageAnalysis.improvedImage;
                                link.download = 'improved-product-image.png';
                                link.click();
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                              <span className="text-white text-xs font-black uppercase tracking-widest">Click to Download</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {activeModule === "AI Product Success Score" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10 text-center">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white">AI Product Success Score</h2>
                        <p className="text-gray-500 font-medium">Evaluate product potential with 95% accuracy using AI.</p>
                      </div>
                      <div className="flex gap-4">
                        <input 
                          type="text"
                          placeholder="Enter Product Name or ASIN"
                          className="flex-1 px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold transition-all"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                          onClick={() => handleAnalyzeSuccessScore(searchQuery)}
                          disabled={loading || !searchQuery}
                          className="bg-sky-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-sky-700 transition-all disabled:opacity-50 shadow-xl shadow-sky-500/20"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Analyze Score"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {successScore && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                      <div className="lg:col-span-1 bg-[#1e293b] p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="relative w-48 h-48">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                            <motion.circle 
                              cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                              strokeDasharray={552.92}
                              initial={{ strokeDashoffset: 552.92 }}
                              animate={{ strokeDashoffset: 552.92 - (552.92 * successScore.score) / 100 }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className="text-sky-500" 
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-black text-white">{successScore.score}</span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Success Score</span>
                          </div>
                        </div>
                        <div className="px-6 py-2 bg-sky-500/10 text-sky-500 rounded-full text-xs font-black uppercase tracking-widest">
                          {successScore.score >= 80 ? "High Potential" : successScore.score >= 60 ? "Moderate Potential" : "High Risk"}
                        </div>
                      </div>

                      <div className="lg:col-span-2 grid grid-cols-2 gap-6">
                        {[
                          { label: "Demand", value: successScore.factors.demand, icon: TrendingUp, color: "text-sky-500" },
                          { label: "Competition", value: successScore.factors.competition, icon: Target, color: "text-amber-500" },
                          { label: "Profit Potential", value: successScore.factors.profit, icon: DollarSign, color: "text-emerald-500" },
                          { label: "Trend", value: successScore.factors.trend, icon: Zap, color: "text-indigo-500" },
                        ].map((factor, idx) => (
                          <div key={idx} className="bg-[#1e293b] p-8 rounded-[2rem] border border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                              <factor.icon className={cn("w-6 h-6", factor.color)} />
                              <span className="text-xl font-black text-white">{factor.value}/100</span>
                            </div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{factor.label}</p>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${factor.value}%` }}
                                className={cn("h-full rounded-full", factor.color.replace('text', 'bg'))}
                              />
                            </div>
                          </div>
                        ))}
                        <div className="col-span-2 bg-sky-500/5 p-8 rounded-[2rem] border border-sky-500/10">
                          <h4 className="text-sm font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-sky-500" /> AI Recommendation
                          </h4>
                          <p className="text-gray-400 text-sm leading-relaxed font-medium">{successScore.recommendation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {activeModule === "AI Launch Strategy" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10 text-center">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white">AI Launch Strategy</h2>
                        <p className="text-gray-500 font-medium">Step-by-step blueprint to dominate your niche from day one.</p>
                      </div>
                      <div className="flex gap-4">
                        <input 
                          type="text"
                          placeholder="Enter Product Name"
                          className="flex-1 px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold transition-all"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                          onClick={() => handleGenerateLaunchStrategy(searchQuery)}
                          disabled={loading || !searchQuery}
                          className="bg-sky-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-sky-700 transition-all disabled:opacity-50 shadow-xl shadow-sky-500/20"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Generate Strategy"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {launchStrategy && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { label: "Phase 1: Pre-Launch", content: launchStrategy.phases.preLaunch, icon: Search },
                          { label: "Phase 2: Launch Week", content: launchStrategy.phases.launchWeek, icon: Rocket },
                          { label: "Phase 3: Post-Launch", content: launchStrategy.phases.postLaunch, icon: TrendingUp },
                        ].map((phase, idx) => (
                          <div key={idx} className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-sky-500/10 rounded-2xl">
                                <phase.icon className="w-6 h-6 text-sky-500" />
                              </div>
                              <h3 className="font-black text-white">{phase.label}</h3>
                            </div>
                            <ul className="space-y-4">
                              {phase.content.map((step: string, sIdx: number) => (
                                <li key={sIdx} className="flex items-start gap-3">
                                  <div className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-[10px] font-black text-sky-500">{sIdx + 1}</span>
                                  </div>
                                  <span className="text-sm text-gray-400 font-medium leading-tight">{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="bg-[#1e293b] p-10 rounded-[2.5rem] border border-white/5">
                        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                          <Target className="w-6 h-6 text-sky-500" /> PPC & Marketing Strategy
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-6">
                            <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">PPC Approach</p>
                            <p className="text-gray-400 font-medium leading-relaxed">{launchStrategy.ppcStrategy}</p>
                          </div>
                          <div className="space-y-6">
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Budget Allocation</p>
                            <div className="space-y-4">
                              {Object.entries(launchStrategy.budgetAllocation).map(([key, val]: any, i) => (
                                <div key={i} className="space-y-2">
                                  <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="text-white">{val}%</span>
                                  </div>
                                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${val}%` }}
                                      className="h-full bg-emerald-500 rounded-full"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {activeModule === "Dashboard" && (
                <div className="space-y-10 pb-20">
                  {/* Performance Metrics Row */}
                  <PerformanceMetrics />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Section */}
                    <div className="lg:col-span-2">
                      <AnalyticsChart />
                    </div>
                    
                    {/* Activity Feed */}
                    <div className="lg:col-span-1">
                      <AIActivityFeed />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Top Opportunity Widget */}
                    <div className="lg:col-span-1">
                      <TopOpportunityWidget />
                    </div>

                    {/* Opportunity Radar */}
                    <div className="lg:col-span-2">
                      <OpportunityRadar />
                    </div>
                  </div>

                  {/* AI Insights Summary */}
                  <AIInsightsSummary />

                  {/* Auto Product Hunter AI Section */}
                  <section className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white flex items-center gap-3">
                          <Search className="w-7 h-7 text-sky-500" /> Auto Product Hunter AI
                        </h3>
                        <p className="text-gray-500 font-medium">Automated daily discovery of profitable opportunities.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" /> Auto Refresh: Daily
                        </div>
                        <button 
                          onClick={generateAutoHunterProducts}
                          disabled={isAutoHunting}
                          className="px-6 py-3 bg-sky-500 text-white rounded-xl font-black text-sm hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 disabled:opacity-50"
                        >
                          {isAutoHunting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                          Find New Opportunities
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                      {isAutoHunting ? (
                        Array(5).fill(0).map((_, i) => (
                          <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-[2rem]" />
                        ))
                      ) : (
                        autoHunterProducts.map((product, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-[#1e293b] p-6 rounded-[2rem] shadow-sm border border-white/5 space-y-4 hover:shadow-xl transition-all group"
                          >
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-sky-500 bg-sky-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">
                                {product.category}
                              </span>
                              <h4 className="font-black text-white line-clamp-2 leading-tight group-hover:text-sky-500 transition-colors">
                                {product.name}
                              </h4>
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span>Demand: <span className="text-sky-500">{product.demand}</span></span>
                                <span>ROI: <span className="text-blue-400">{product.roi}</span></span>
                              </div>
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span>Comp: <span className="text-sky-400">{product.competition}</span></span>
                                <span>{product.trend}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Opp. Score</span>
                                <span className="text-xs font-black text-sky-500">{product.score}/100</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${product.score}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className="h-full bg-sky-500 rounded-full"
                                />
                              </div>
                            </div>

                            <button 
                              onClick={() => {
                                setSearchQuery(product.name);
                                handleSource(product.name);
                              }}
                              className="w-full py-3 bg-white/5 text-white rounded-xl font-bold text-xs hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                              Analyze Supplier <ArrowUpRight className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* AI Business Insights */}
                      <div className="lg:col-span-2 bg-[#1e293b] p-10 rounded-[2.5rem] shadow-sm border border-white/5 space-y-8">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-black text-white flex items-center gap-3">
                            <BarChart3 className="w-7 h-7 text-sky-500" /> AI Business Insights
                          </h3>
                          <span className="text-[10px] font-black text-sky-500 bg-sky-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Manager Mode</span>
                        </div>

                        {!businessInsights ? (
                          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-600">
                              <Zap className="w-8 h-8" />
                            </div>
                            <p className="text-gray-500 font-bold max-w-xs">Ask the AI Assistant to analyze a product or niche to see deep business insights here.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                              { label: "Market Trend", value: businessInsights.marketTrend, desc: "Current trajectory of the niche" },
                              { label: "Competition Risk", value: businessInsights.competitionRisk, desc: "Threat level from existing sellers" },
                              { label: "Profit Potential", value: businessInsights.profitPotential, desc: "Estimated margins and scalability" },
                              { label: "Launch Difficulty", value: businessInsights.launchDifficulty, desc: "Effort required for initial traction" }
                            ].map((insight, i) => (
                              <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-6">
                                <div className={cn(
                                  "w-4 h-4 rounded-full shadow-lg",
                                  insight.value === 'Green' ? "bg-sky-500 shadow-sky-500/20" : 
                                  insight.value === 'Yellow' ? "bg-yellow-500 shadow-yellow-500/20" : "bg-red-500 shadow-red-500/20"
                                )} />
                                <div>
                                  <p className="text-sm font-black text-white">{insight.label}</p>
                                  <p className="text-xs font-bold text-gray-500">{insight.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* AI Opportunity Alerts */}
                      <div className="bg-[#1e293b] p-10 rounded-[2.5rem] shadow-sm border border-white/5 space-y-8">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-black text-white flex items-center gap-3">
                            <Bell className="w-7 h-7 text-sky-500" /> Opportunity Alerts
                          </h3>
                        </div>

                        <div className="space-y-4">
                          {opportunityAlerts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No active alerts</p>
                            </div>
                          ) : (
                            opportunityAlerts.map((alert, i) => (
                              <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-sky-500/10 rounded-2xl border border-sky-500/20 space-y-2"
                              >
                                <div className="flex justify-between items-start">
                                  <p className="text-xs font-black text-sky-200 uppercase tracking-widest">{alert.title}</p>
                                  <span className="text-[10px] font-black text-sky-500">{alert.roi} ROI</span>
                                </div>
                                <p className="text-sm font-bold text-white">{alert.description}</p>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {!isAutoHunting && autoHunterProducts.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-sky-500/10 p-6 rounded-2xl border border-sky-500/20 flex flex-col md:flex-row items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#1e293b] rounded-full flex items-center justify-center shadow-sm">
                            <Zap className="w-6 h-6 text-sky-500 fill-sky-500" />
                          </div>
                          <p className="text-sm font-bold text-sky-200">
                            "I found some promising products. Would you like me to analyze suppliers for one of these?"
                          </p>
                        </div>
                        <button 
                          onClick={() => setActiveModule("Product Sourcing")}
                          className="px-8 py-3 bg-sky-500 text-white rounded-xl font-black text-sm hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20"
                        >
                          Go to Sourcing Module
                        </button>
                      </motion.div>
                    )}
                  </section>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-[3rem] p-16 text-white relative overflow-hidden shadow-2xl shadow-sky-500/20"
                  >
                    <div className="relative z-10 max-w-3xl space-y-8">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-white/10">
                          <Zap className="w-4 h-4 fill-white" /> AI Agent Active
                        </div>
                        <h1 className="text-6xl font-black leading-[1.1] tracking-tight">Your selling business is <span className="text-sky-200">scaling.</span></h1>
                        <p className="text-white/80 text-xl font-medium max-w-xl leading-relaxed">We found 5 new high-potential market gaps in the {selectedMarketplace} market today. Ready to dominate?</p>
                      </div>
                      <button 
                        onClick={() => setActiveModule("Market Gap Detector")}
                        className="bg-white text-sky-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-sky-50 transition-all flex items-center gap-3 shadow-2xl shadow-black/10 active:scale-95"
                      >
                        Explore Market Gaps <ArrowUpRight className="w-6 h-6" />
                      </button>
                    </div>
                    
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                      <Zap className="w-full h-full rotate-12 scale-150 translate-x-1/4" />
                    </div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  </motion.div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[#1e293b] p-10 rounded-[2.5rem] shadow-sm border border-white/5 space-y-6">
                      <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-sky-500" /> Recent Activity
                      </h3>
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500">
                              <Search className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-white">Product Hunt: "Kitchen Gadgets"</p>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">2 hours ago</p>
                            </div>
                            <span className="text-xs font-black text-sky-500">+12 found</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#1e293b] p-10 rounded-[2.5rem] shadow-sm border border-white/5 space-y-6">
                      <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <Target className="w-6 h-6 text-sky-500" /> Strategic Tips
                      </h3>
                      <div className="space-y-4">
                        <div className="p-6 bg-sky-500/10 rounded-2xl border border-sky-500/20">
                          <p className="text-sm font-bold text-sky-200 leading-relaxed">
                            "The {selectedMarket} market is showing high demand for eco-friendly packaging. Consider sourcing sustainable alternatives for your top products."
                          </p>
                        </div>
                        <div className="p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                          <p className="text-sm font-bold text-blue-200 leading-relaxed">
                            "Q4 is approaching. Start analyzing seasonal trends now to secure inventory before supplier lead times increase."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Opportunity Radar */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-white flex items-center gap-3">
                        <Zap className="w-7 h-7 text-sky-500 fill-sky-500" /> AI Opportunity Radar
                      </h3>
                      <span className="text-xs font-black text-sky-500 bg-sky-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Live Analysis</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { category: "Portable Blender", demand: "High", competition: "Medium", roi: "120%", trend: "Rising 📈" },
                        { category: "Eco-Friendly Yoga Mats", demand: "Very High", competition: "Low", roi: "145%", trend: "Exploding 🔥" },
                        { category: "Smart Pet Feeders", demand: "High", competition: "High", roi: "95%", trend: "Stable 📊" }
                      ].map((opp, idx) => (
                        <motion.div 
                          key={idx}
                          whileHover={{ y: -8, scale: 1.02 }}
                          className="bg-[#1e293b] p-8 rounded-[2.5rem] shadow-sm border border-white/5 space-y-6 hover:shadow-2xl hover:shadow-sky-500/5 transition-all group"
                        >
                          <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500 group-hover:rotate-6 transition-transform">
                              <Target className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-sky-500 bg-sky-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">
                              {opp.trend}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xl font-black text-white">{opp.category}</h4>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                              <span className="text-gray-500">Demand: <span className="text-sky-500">{opp.demand}</span></span>
                              <span className="text-gray-500">Comp: <span className="text-blue-500">{opp.competition}</span></span>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Est. ROI</p>
                              <p className="text-2xl font-black text-sky-500">{opp.roi}</p>
                            </div>
                            <button 
                              onClick={() => {
                                setSearchQuery(opp.category);
                                handleHunt(opp.category);
                              }}
                              className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-sky-500 hover:bg-sky-500/10 transition-all"
                            >
                              <ArrowUpRight className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeModule === "Auto Research Mode" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-12 rounded-[3rem] shadow-2xl border border-sky-500/20 relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 via-sky-600 to-sky-400" />
                    <div className="max-w-2xl mx-auto space-y-6">
                      <div className="w-24 h-24 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Zap className="w-12 h-12 text-sky-600 fill-sky-600" />
                      </div>
                      <h2 className="text-4xl font-black text-white tracking-tighter">Autonomous Research Workflow</h2>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        Activate the AI Agent to autonomously search trending products, analyze demand, find suppliers, and calculate profit for the best opportunities.
                      </p>
                      <button 
                        onClick={handleAutoResearch}
                        disabled={loading}
                        className="bg-sky-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-sky-700 transition-all disabled:opacity-50 flex items-center justify-center gap-4 mx-auto shadow-2xl shadow-sky-500/20 hover:scale-105 active:scale-95"
                      >
                        {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Zap className="w-8 h-8 fill-white" /> Activate Auto Research</>}
                      </button>
                    </div>
                  </div>

                  {autoResearchData && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Top Opportunity Card */}
                        <div className="lg:col-span-2 bg-[#1e293b] p-10 rounded-[3rem] shadow-xl border border-white/5 space-y-8">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <span className="px-4 py-1.5 bg-sky-500/10 text-sky-500 text-[10px] font-black rounded-full uppercase tracking-widest">
                                Top Opportunity Found
                              </span>
                              <h3 className="text-3xl font-black text-white tracking-tight">{autoResearchData.product.name}</h3>
                              <p className="text-gray-500 font-mono text-sm">ASIN: {autoResearchData.product.asin}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Target Price</p>
                              <p className="text-4xl font-black text-sky-500">${autoResearchData.product.price}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/5 p-6 rounded-[2rem]">
                              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Market Demand</p>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-sky-500" />
                                <span className="text-xl font-black text-white">{autoResearchData.product.demand}</span>
                              </div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-[2rem]">
                              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Competition</p>
                              <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-sky-500" />
                                <span className="text-xl font-black text-white">{autoResearchData.product.competition}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                              <Zap className="w-4 h-4 fill-sky-500" /> Strategic Recommendations
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {autoResearchData.recommendations.map((rec: string, idx: number) => (
                                <div key={idx} className="bg-sky-500/10 p-5 rounded-2xl border border-sky-500/20 text-sm text-sky-200 leading-relaxed">
                                  {rec}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-sky-600 p-10 rounded-[3rem] shadow-xl text-white flex flex-col justify-between">
                          <div className="space-y-6">
                            <h3 className="text-2xl font-black tracking-tight">AI Executive Summary</h3>
                            <p className="text-sky-100 leading-relaxed text-lg italic">
                              "{autoResearchData.summary}"
                            </p>
                          </div>
                          <div className="pt-8 space-y-4">
                            <button 
                              onClick={() => {
                                setActiveModule("Listing Generator");
                                setSearchQuery(autoResearchData.product.name);
                              }}
                              className="w-full py-5 bg-white text-sky-600 rounded-2xl font-black hover:scale-[1.02] transition-all"
                            >
                              Generate Listing
                            </button>
                            <button 
                              onClick={() => {
                                setActiveModule("Competition Analyzer");
                                setSearchQuery(autoResearchData.product.name);
                                handleAnalyzeCompetition();
                              }}
                              className="w-full py-5 bg-black/20 text-white rounded-2xl font-black hover:scale-[1.02] transition-all border border-white/20"
                            >
                              Analyze Competition
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Suppliers Table */}
                      <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-xl border border-white/5 overflow-hidden">
                        <h3 className="text-2xl font-black text-white mb-8 tracking-tight">Top 3 Sourcing Options</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left border-b border-white/5">
                                <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Supplier</th>
                                <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Unit Cost</th>
                                <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">MOQ</th>
                                <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Est. Profit</th>
                                <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">ROI</th>
                                <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {autoResearchData.suppliers.map((s: any, idx: number) => (
                                <tr key={idx} className="group">
                                  <td className="py-6 font-black text-white">{s.supplierName}</td>
                                  <td className="py-6 font-bold text-sky-500">${s.price}</td>
                                  <td className="py-6 text-gray-400">{s.moq} units</td>
                                  <td className="py-6 font-bold text-sky-400">${s.estimatedProfit}</td>
                                  <td className="py-6">
                                    <span className="px-3 py-1 bg-sky-500/10 text-sky-400 text-xs font-black rounded-full">
                                      {s.roi}%
                                    </span>
                                  </td>
                                  <td className="py-6">
                                    <button 
                                      onClick={() => {
                                        setActiveModule("Product Sourcing");
                                        setSearchQuery(autoResearchData.product.name);
                                        handleSource(autoResearchData.product.name);
                                      }}
                                      className="p-2 bg-white/5 rounded-xl text-gray-500 hover:text-sky-500 transition-colors"
                                    >
                                      <ArrowUpRight className="w-5 h-5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {activeModule === "Market Gap Detector" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[2.5rem] shadow-sm border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black text-white tracking-tight">AI Market Gap Detector</h2>
                      <p className="text-gray-500">Automatically find products with high demand, low competition, and high ROI potential.</p>
                    </div>
                    <button 
                      onClick={handleMarketGapDetection}
                      disabled={loading}
                      className="bg-sky-600 text-white px-10 py-5 rounded-3xl font-black hover:bg-sky-700 transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-sky-500/20 whitespace-nowrap"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Zap className="w-6 h-6 fill-white" /> Scan for Gaps</>}
                    </button>
                  </div>

                  {marketGaps.length > 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#1e293b] rounded-[2.5rem] shadow-sm border border-white/5 overflow-hidden"
                    >
                      <div className="p-10 overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1200px]">
                          <thead>
                            <tr className="border-b border-white/5">
                              <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-4">Product Title</th>
                              <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Demand</th>
                              <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Competition</th>
                              <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Score</th>
                              <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Price</th>
                              <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Sourcing</th>
                              <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Margin</th>
                              <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Explanation</th>
                              <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Recommendation</th>
                              <th className="pb-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pr-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {marketGaps.map((p) => (
                              <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="py-8 pl-4">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-white font-black text-sm group-hover:text-sky-500 transition-colors">{p.name}</span>
                                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">ASIN: {p.asin}</span>
                                  </div>
                                </td>
                                <td className="py-8">
                                  <span className="px-3 py-1 bg-sky-500/10 text-sky-400 text-[10px] font-black rounded-full uppercase tracking-widest">
                                    {p.demand}
                                  </span>
                                </td>
                                <td className="py-8">
                                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest">
                                    {p.competition}
                                  </span>
                                </td>
                                <td className="py-8">
                                  <div className="flex items-center gap-2">
                                    <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-sky-500 rounded-full" 
                                        style={{ width: `${p.opportunityScore || 0}%` }}
                                      />
                                    </div>
                                    <span className="text-white font-black text-xs">{p.opportunityScore}%</span>
                                  </div>
                                </td>
                                <td className="py-8">
                                  <span className="text-white font-black text-sm">${p.price}</span>
                                </td>
                                <td className="py-8">
                                  <span className="text-gray-400 font-bold text-sm">${p.estimatedCost}</span>
                                </td>
                                <td className="py-8">
                                  <span className="text-emerald-400 font-black text-sm">{p.profitMargin}%</span>
                                </td>
                                <td className="py-8 max-w-[200px]">
                                  <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">{p.explanation}</p>
                                </td>
                                <td className="py-8 max-w-[200px]">
                                  <p className="text-sky-400/80 text-[11px] leading-relaxed italic line-clamp-2">{p.recommendation}</p>
                                </td>
                                <td className="py-8 pr-4 text-right">
                                  <button 
                                    onClick={() => {
                                      setActiveModule("Product Sourcing");
                                      setSearchQuery(p.name);
                                      handleSource(p.name);
                                    }}
                                    className="p-3 bg-sky-500/10 text-sky-500 rounded-xl hover:bg-sky-500 hover:text-white transition-all"
                                    title="Find Suppliers"
                                  >
                                    <Package className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  ) : !loading && (
                    <div className="bg-[#1e293b] p-20 rounded-[3rem] border border-white/5 text-center space-y-6">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-600">
                        <BarChart3 className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-white">No Market Gaps Found Yet</h3>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto">Click the scan button above to let our AI analyze the {selectedMarket} market for untapped opportunities.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeModule === "Product Hunting" && (
                <div className="space-y-10">
                  <div className="bg-[#1e293b] p-12 rounded-[3rem] shadow-2xl shadow-sky-500/5 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-sky-500/10 transition-all duration-700" />
                    
                    <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                      <div className="text-center space-y-3">
                        <h2 className="text-4xl font-black text-white tracking-tight">Product Hunting</h2>
                        <p className="text-gray-500 font-medium text-lg">Find high-demand, low-competition products in seconds.</p>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group/input">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6 group-focus-within/input:text-sky-500 transition-colors" />
                          <input 
                            type="text"
                            placeholder='Search product category or keywords (e.g. "Portable Blender")'
                            className="w-full pl-16 pr-8 py-6 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] focus:ring-8 focus:ring-sky-500/5 transition-all outline-none text-lg font-bold placeholder:text-gray-500 text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <button 
                          onClick={() => handleHunt(searchQuery)}
                          disabled={loading || !searchQuery}
                          className="px-10 py-6 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-[2rem] font-black text-lg hover:shadow-2xl hover:shadow-sky-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95 group"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>
                              <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                              <span>Start Hunting</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {products.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {products.map((p) => (
                        <motion.div 
                          key={p.id}
                          whileHover={{ y: -8 }}
                          className="bg-[#1e293b] rounded-[2.5rem] shadow-sm border border-white/5 overflow-hidden group hover:shadow-2xl transition-all"
                        >
                          <div className="p-8 space-y-6">
                            <div className="flex justify-between items-start">
                              <span className="px-4 py-1.5 bg-sky-500/10 text-sky-400 text-[10px] font-black rounded-full uppercase tracking-widest">
                                {p.marketplace || selectedMarketplace} Marketplace
                              </span>
                              <div className={cn(
                                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                                p.competition === "Low" ? "bg-sky-500/10 text-sky-400" : 
                                p.competition === "Medium" ? "bg-yellow-500/10 text-yellow-400" : 
                                "bg-red-500/10 text-red-400"
                              )}>
                                {p.competition} Competition
                              </div>
                            </div>

                            <div>
                              <h3 className="text-xl font-black text-white mb-2 line-clamp-2 leading-tight group-hover:text-sky-500 transition-colors">{p.name}</h3>
                              <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
                                <Package className="w-3 h-3" />
                                <span>ASIN: {p.asin}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/5 p-5 rounded-3xl">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">List Price</p>
                                <p className="text-2xl font-black text-white">${p.price}</p>
                              </div>
                              <div className="bg-sky-500/10 p-5 rounded-3xl border border-sky-500/20">
                                <p className="text-[10px] text-sky-400 uppercase font-black tracking-widest mb-1">Est. Profit</p>
                                <p className="text-2xl font-black text-sky-400">${p.profit}</p>
                              </div>
                            </div>

                            {p.suggestions && p.suggestions.length > 0 && (
                              <div className="bg-sky-500/10 p-4 rounded-2xl border border-sky-500/20 space-y-2">
                                <p className="text-[10px] text-sky-400 uppercase font-black tracking-widest flex items-center gap-2">
                                  <Zap className="w-3 h-3 fill-sky-500" /> AI Business Insights
                                </p>
                                <ul className="space-y-1">
                                  {p.suggestions.map((s, idx) => (
                                    <li key={idx} className="text-[11px] text-sky-200 leading-relaxed">• {s}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex flex-col gap-3 pt-4">
                              <button 
                                onClick={() => {
                                  setActiveModule("Product Sourcing");
                                  setSearchQuery(p.name);
                                  handleSource(p.name);
                                }}
                                className="w-full py-5 bg-sky-600 text-white rounded-2xl font-black hover:bg-sky-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20"
                              >
                                <Zap className="w-5 h-5 fill-white" /> Find Profitable Supplier
                              </button>
                              <div className="flex gap-3">
                                <a 
                                  href={p.link} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 text-gray-300 rounded-2xl font-black hover:bg-white/10 transition-all text-sm"
                                >
                                  <ShoppingCart className="w-4 h-4" /> View Product
                                </a>
                                <button 
                                  onClick={() => {
                                    setActiveModule("Listing Generator");
                                    setSearchQuery(p.name);
                                  }}
                                  className="flex-1 py-4 bg-white text-black rounded-2xl font-black hover:scale-[1.02] transition-all text-sm"
                                >
                                  Generate Listing
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeModule === "Product Sourcing" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-8 rounded-[2.5rem] shadow-sm border border-white/5">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
                        <input 
                          type="text"
                          placeholder="Enter product name to find suppliers..."
                          className="w-full pl-14 pr-6 py-5 bg-white/5 border-none rounded-3xl focus:ring-2 focus:ring-sky-500 transition-all outline-none text-lg font-medium text-white"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={() => handleSource(searchQuery)}
                        disabled={loading}
                        className="bg-sky-600 text-white px-10 py-5 rounded-3xl font-black hover:bg-sky-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-sky-500/20 min-w-[200px]"
                      >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Zap className="w-6 h-6 fill-white" /> Find Suppliers</>}
                      </button>
                    </div>

                    {/* Smart Filters */}
                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-6 items-center">
                      <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Filters:</span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
                        <span className="text-xs font-bold text-gray-500">Price:</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={filters.priceRange[1]}
                          onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                          className="w-24 accent-sky-500"
                        />
                        <span className="text-xs font-bold text-white">${filters.priceRange[1]}</span>
                      </div>

                      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
                        <span className="text-xs font-bold text-gray-500">Min MOQ:</span>
                        <input 
                          type="number" 
                          className="w-16 bg-transparent border-none text-xs font-bold focus:ring-0 outline-none text-white"
                          value={filters.minMOQ}
                          onChange={(e) => setFilters({...filters, minMOQ: parseInt(e.target.value) || 0})}
                        />
                      </div>

                      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
                        <span className="text-xs font-bold text-gray-500">Min Rating:</span>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(star => (
                            <Star 
                              key={star}
                              className={cn("w-3 h-3 cursor-pointer transition-colors", star <= filters.minRating ? "text-sky-500 fill-sky-500" : "text-gray-600")}
                              onClick={() => setFilters({...filters, minRating: star})}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {sourcingOptions.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {sourcingOptions
                        .filter(s => s.price <= filters.priceRange[1] && s.moq >= filters.minMOQ && s.rating >= filters.minRating)
                        .map((s) => (
                        <motion.div 
                          key={s.id}
                          whileHover={{ y: -8 }}
                          className="bg-[#1e293b] rounded-[2.5rem] shadow-sm border border-white/5 overflow-hidden group hover:shadow-2xl transition-all"
                        >
                          <div className="p-8 space-y-6">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                                <Globe className="w-3 h-3 text-gray-500" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{s.platform}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sky-500">
                                <Star className="w-4 h-4 fill-sky-500" />
                                <span className="text-sm font-black">{s.rating}</span>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-xl font-black text-white mb-1 group-hover:text-sky-500 transition-colors">{s.supplierName}</h3>
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>{s.location}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/5 p-4 rounded-3xl">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Price/Unit</p>
                                <p className="text-xl font-black text-sky-500">${s.price}</p>
                              </div>
                              <div className="bg-white/5 p-4 rounded-3xl">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Min Order</p>
                                <p className="text-xl font-black text-white">{s.moq} units</p>
                              </div>
                            </div>

                            {/* Profit Analysis Box */}
                            <div className="bg-sky-500/10 p-6 rounded-[2rem] border border-sky-500/20 space-y-3">
                              <div className="flex items-center justify-between text-xs font-bold text-sky-400 uppercase tracking-wider">
                                <span>Profit Analysis</span>
                                <div className="flex items-center gap-1">
                                  <Zap className="w-3 h-3 fill-sky-500" />
                                  <span>AI Verified</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <span className="text-sky-400/60">Selling Price:</span>
                                <span className="text-right font-bold text-white">${s.sellingPrice || s.amazonPrice}</span>
                                <span className="text-sky-400/60">Supplier Cost:</span>
                                <span className="text-right font-bold text-white">${s.price}</span>
                                <span className="text-sky-400/60">Platform Fees:</span>
                                <span className="text-right font-bold text-white">${s.platformFees || s.amazonFees}</span>
                                <div className="col-span-2 pt-2 mt-2 border-t border-sky-500/20 flex justify-between items-center">
                                  <span className="font-black text-sky-400">Est. Profit:</span>
                                  <span className="text-xl font-black text-sky-500">${s.estimatedProfit}</span>
                                </div>
                                <div className="col-span-2 flex justify-between items-center">
                                  <span className="font-black text-sky-400">ROI:</span>
                                  <span className="px-3 py-1 bg-sky-600 text-white text-xs font-black rounded-full">{s.roi}%</span>
                                </div>
                              </div>
                            </div>

                            {s.suggestions && s.suggestions.length > 0 && (
                              <div className="bg-sky-500/10 p-4 rounded-2xl border border-sky-500/20 space-y-2">
                                <p className="text-[10px] text-sky-400 uppercase font-black tracking-widest flex items-center gap-2">
                                  <Zap className="w-3 h-3 fill-sky-500" /> AI Business Insights
                                </p>
                                <ul className="space-y-1">
                                  {s.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="text-[11px] text-sky-200 leading-relaxed">• {suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex flex-col gap-3 pt-4">
                              <button 
                                onClick={() => setSelectedSupplier(s)}
                                className="w-full py-4 bg-white text-black rounded-2xl font-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                              >
                                View Supplier <ArrowUpRight className="w-5 h-5" />
                              </button>
                              <div className="flex gap-3">
                                <button 
                                  onClick={() => handleGenerateEmail("Inquiry", s.supplierName)}
                                  className="flex-1 py-4 bg-sky-500/10 text-sky-400 rounded-2xl font-black hover:bg-sky-500/20 transition-all text-sm"
                                >
                                  Contact
                                </button>
                                <button 
                                  onClick={() => copyToClipboard(s.email)}
                                  className="flex-1 py-4 bg-white/5 text-gray-500 rounded-2xl font-black hover:bg-white/10 transition-all text-sm"
                                >
                                  {copied ? "Copied!" : "Copy Email"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeModule === "Listing Generator" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                      <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black text-white">AI Listing Generator</h2>
                        <p className="text-gray-500 font-medium">Create high-converting Amazon listings with SEO optimization.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-4">Product Name or Keywords</label>
                          <input 
                            type="text"
                            placeholder="e.g. Ergonomic Office Chair with Lumbar Support"
                            className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-4">Tone of Voice</label>
                            <select className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold appearance-none cursor-pointer">
                              <option className="bg-[#1e293b]">Professional</option>
                              <option className="bg-[#1e293b]">Persuasive</option>
                              <option className="bg-[#1e293b]">Friendly</option>
                              <option className="bg-[#1e293b]">Technical</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-4">Target Audience</label>
                            <select className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold appearance-none cursor-pointer">
                              <option className="bg-[#1e293b]">General</option>
                              <option className="bg-[#1e293b]">Professionals</option>
                              <option className="bg-[#1e293b]">Parents</option>
                              <option className="bg-[#1e293b]">Techies</option>
                            </select>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleGenerateListing()}
                          disabled={loading || !searchQuery}
                          className="w-full py-6 bg-sky-600 text-white rounded-[2rem] font-black text-lg hover:bg-sky-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-sky-500/20"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-6 h-6" /> Generate SEO Listing</>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {listing && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-white">Generated Content</h3>
                            <button 
                              onClick={() => copyToClipboard(listing.title + "\n\n" + listing.bulletPoints.join("\n") + "\n\n" + listing.description)}
                              className="px-6 py-2 bg-white/5 text-gray-400 rounded-full text-xs font-black hover:bg-white/10 transition-all"
                            >
                              {copied ? "Copied!" : "Copy All"}
                            </button>
                          </div>
                          
                          <div className="space-y-8">
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">Optimized Title</label>
                              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-white font-bold leading-relaxed">
                                {listing.title}
                              </div>
                            </div>

                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">Key Features (Bullet Points)</label>
                              <div className="space-y-3">
                                {listing.bulletPoints.map((b, i) => (
                                  <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 text-gray-300 text-sm leading-relaxed flex gap-4">
                                    <span className="text-sky-500 font-black">{i + 1}.</span>
                                    {b}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">Product Description</label>
                              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {listing.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-sky-600 p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl shadow-sky-500/20">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                              <Zap className="w-6 h-6 fill-white" />
                            </div>
                            <h3 className="text-xl font-black">SEO Score: 98/100</h3>
                          </div>
                          <p className="text-sky-100 text-sm font-medium leading-relaxed">
                            This listing is highly optimized for Amazon's A9 algorithm. We've included all high-volume keywords and structured the content for maximum conversion.
                          </p>
                          <div className="space-y-3">
                            {['High-Volume Keywords', 'Readability Score', 'Mobile Optimized', 'Benefit-Driven'].map((item) => (
                              <div key={item} className="flex items-center gap-2 text-xs font-black">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                          <h4 className="text-sm font-black text-white uppercase tracking-widest">Target Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {['ergonomic', 'office chair', 'lumbar support', 'breathable mesh', 'adjustable arms'].map(kw => (
                              <span key={kw} className="px-3 py-1.5 bg-white/5 text-gray-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-white/5">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}


              {activeModule === "Contact Dashboard" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                      <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black text-white">AI Contact Dashboard</h2>
                        <p className="text-gray-500 font-medium">Professional templates to get the best quotes from suppliers.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-4">Product or Supplier Name</label>
                          <input 
                            type="text"
                            placeholder="e.g. Shenzhen Electronics Co."
                            className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-4">Email Type</label>
                            <select 
                              className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold appearance-none cursor-pointer"
                              onChange={(e) => handleGenerateEmail(e.target.value)}
                            >
                              <option className="bg-[#1e293b]">Initial Inquiry</option>
                              <option className="bg-[#1e293b]">Price Negotiation</option>
                              <option className="bg-[#1e293b]">Sample Request</option>
                              <option className="bg-[#1e293b]">Shipping Inquiry</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-4">Urgency Level</label>
                            <select className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold appearance-none cursor-pointer">
                              <option className="bg-[#1e293b]">Normal</option>
                              <option className="bg-[#1e293b]">High</option>
                              <option className="bg-[#1e293b]">Low</option>
                            </select>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleGenerateEmail("Inquiry")}
                          disabled={loading || !searchQuery}
                          className="w-full py-6 bg-sky-600 text-white rounded-[2rem] font-black text-lg hover:bg-sky-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-sky-500/20"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Mail className="w-6 h-6" /> Generate Email</>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {email && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-4xl mx-auto"
                    >
                      <div className="bg-[#1e293b] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                        <div className="bg-white/5 px-10 py-6 border-bottom border-white/5 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-sky-500" />
                            <h3 className="text-lg font-black text-white">Email Draft</h3>
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => copyToClipboard(email.subject + "\n\n" + email.body)}
                              className="px-6 py-2 bg-sky-600 text-white rounded-full text-xs font-black hover:bg-sky-700 transition-all flex items-center gap-2"
                            >
                              <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy Email"}
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-10 space-y-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Subject Line</label>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-white font-bold">
                              {email.subject}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Message Body</label>
                            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                              {email.body}
                            </div>
                          </div>

                          <div className="bg-sky-500/10 p-6 rounded-2xl border border-sky-500/20 flex items-start gap-4">
                            <div className="p-2 bg-sky-500 rounded-lg shrink-0">
                              <Zap className="w-5 h-5 fill-white" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-black text-white">AI Negotiation Tip</p>
                              <p className="text-xs text-sky-200 leading-relaxed">
                                We've included specific questions about MOQ and lead times to show you're a serious buyer. This often results in 10-15% better initial quotes.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex items-center justify-between px-4">
                      <h3 className="text-lg font-black text-white">Recent Contacts</h3>
                      <button className="text-sky-500 text-xs font-black uppercase tracking-widest hover:text-sky-400 transition-colors">View All</button>
                    </div>
                    
                    <div className="grid gap-4">
                      {[
                        { name: "Shenzhen Electronics Co.", date: "2 hours ago", status: "Sent", type: "Price Negotiation" },
                        { name: "Global Sourcing Ltd.", date: "Yesterday", status: "Replied", type: "Initial Inquiry" },
                        { name: "Eco-Friendly Pack Co.", date: "Mar 14, 2026", status: "Sent", type: "Sample Request" }
                      ].map((contact, i) => (
                        <div key={i} className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-all cursor-pointer group">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all">
                              <Mail className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-white font-black">{contact.name}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{contact.type}</span>
                                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{contact.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              contact.status === "Replied" ? "bg-emerald-500/10 text-emerald-400" : "bg-sky-500/10 text-sky-400"
                            }`}>
                              {contact.status}
                            </span>
                            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeModule === "Trend Detector" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black text-white">Market Trends</h2>
                      <p className="text-sm text-gray-500 font-medium">Identify high-growth niches before they go mainstream.</p>
                    </div>
                    <button 
                      onClick={handleFetchTrends}
                      disabled={loading}
                      className="bg-sky-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-sky-700 transition-all flex items-center gap-2 shadow-lg shadow-sky-500/20"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                      Refresh Trends
                    </button>
                  </div>

                  {trends.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {trends.map((t, i) => (
                        <div key={i} className="bg-[#1e293b] p-8 rounded-[2.5rem] shadow-sm border border-white/5 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-sky-500/10 transition-colors" />
                          <h3 className="font-black text-xl text-white mb-6 relative z-10">{t.niche}</h3>
                          <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-gray-500">Demand Score</span>
                                <span className="text-sky-500">{t.demandScore}/100</span>
                              </div>
                              <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${t.demandScore}%` }}
                                  className="h-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-gray-500">Competition Level</span>
                                <span className="text-sky-400">{t.competitionScore}/100</span>
                              </div>
                              <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${t.competitionScore}%` }}
                                  className="h-full bg-sky-400/50"
                                />
                              </div>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Growth Rate</span>
                              <span className="text-sky-500 font-black text-lg">{t.growthRate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeModule === "Competition Analyzer" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-10 rounded-[3rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                      <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black text-white">Competition Analyzer</h2>
                        <p className="text-gray-500 font-medium">Deep-dive into your competitors' strategies and weaknesses.</p>
                      </div>

                      <div className="flex gap-4">
                        <div className="relative flex-1">
                          <BarChart3 className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
                          <input 
                            type="text"
                            placeholder="Enter Product Name to Analyze"
                            className="w-full pl-16 pr-6 py-5 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2rem] outline-none text-white font-bold transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <button 
                          onClick={handleAnalyzeCompetition}
                          disabled={loading}
                          className="bg-sky-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-sky-700 transition-all disabled:opacity-50 shadow-xl shadow-sky-500/20"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Analyze Market"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {competitionData && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                      <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5">
                          <h3 className="text-xl font-black text-white mb-8">Top Competitors</h3>
                          <div className="space-y-6">
                            {competitionData.competitors.map((comp: any, i: number) => (
                              <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-sky-500/20 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                  <span className="font-black text-lg text-white">{comp.name}</span>
                                  <span className="text-[10px] font-black bg-sky-500/10 text-sky-500 px-4 py-1.5 rounded-full uppercase tracking-widest">{comp.sales} sales/mo</span>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                  <div className="space-y-3">
                                    <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">Strengths</p>
                                    <ul className="text-sm text-gray-400 space-y-2">
                                      {comp.strengths.map((s: string, j: number) => (
                                        <li key={j} className="flex items-center gap-2">
                                          <div className="w-1 h-1 bg-sky-500 rounded-full" />
                                          {s}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="space-y-3">
                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Weaknesses</p>
                                    <ul className="text-sm text-gray-400 space-y-2">
                                      {comp.weaknesses.map((w: string, j: number) => (
                                        <li key={j} className="flex items-center gap-2">
                                          <div className="w-1 h-1 bg-red-500 rounded-full" />
                                          {w}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                          <h3 className="text-xl font-black text-white">Market Stats</h3>
                          <div className="space-y-8">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Avg Reviews</p>
                              <p className="text-3xl font-black text-white">{competitionData.avgReviews}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Avg Rating</p>
                              <p className="text-3xl font-black text-white">{competitionData.avgRating} <span className="text-sm text-gray-500">/ 5</span></p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Price Range</p>
                              <p className="text-3xl font-black text-sky-500">{competitionData.priceRange}</p>
                            </div>
                          </div>
                        </div>

                        <div className={cn(
                          "p-8 rounded-[2.5rem] border relative overflow-hidden",
                          competitionData.recommendation.toLowerCase().includes("enter") 
                            ? "bg-sky-500/10 border-sky-500/20" 
                            : "bg-red-500/10 border-red-500/20"
                        )}>
                          <div className="relative z-10 space-y-4">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">AI Verdict</h3>
                            <p className={cn(
                              "text-2xl font-black leading-tight",
                              competitionData.recommendation.toLowerCase().includes("enter") ? "text-sky-500" : "text-red-500"
                            )}>
                              {competitionData.recommendation}
                            </p>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium">
                              {competitionData.reasoning}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {activeModule === "History" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5">
                      <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                        <Search className="w-6 h-6 text-sky-500" />
                        Saved Products
                      </h2>
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                        {history.products.length > 0 ? history.products.map((p, i) => (
                          <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-sky-500/20 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                              <span className="font-black text-white group-hover:text-sky-500 transition-colors">{p.name}</span>
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{p.asin}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sky-500 font-black text-lg">${p.price}</span>
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{p.market}</span>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-20 space-y-4">
                            <Search className="w-12 h-12 text-sky-500/20 mx-auto" />
                            <p className="text-gray-500 font-medium">No products saved yet.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5">
                      <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                        <FileText className="w-6 h-6 text-sky-500" />
                        Saved Listings
                      </h2>
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                        {history.listings.length > 0 ? history.listings.map((l, i) => (
                          <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-sky-500/20 transition-all group">
                            <p className="font-black text-white mb-2 group-hover:text-sky-500 transition-colors">{l.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-2 font-medium leading-relaxed">{l.content.description}</p>
                          </div>
                        )) : (
                          <div className="text-center py-20 space-y-4">
                            <FileText className="w-12 h-12 text-sky-500/20 mx-auto" />
                            <p className="text-gray-500 font-medium">No listings saved yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModule === "Export Data" && (
                <div className="bg-[#1e293b] p-16 rounded-[3rem] shadow-sm border border-white/5 text-center space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/5 blur-[120px] rounded-full" />
                  
                  <div className="max-w-md mx-auto relative z-10 space-y-8">
                    <div className="w-24 h-24 bg-sky-500/10 text-sky-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-sky-500/10">
                      <Download className="w-12 h-12" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white mb-3">Export Your Research</h2>
                      <p className="text-gray-500 font-medium text-lg">Download all your product hunting and sourcing data in professional Excel or CSV formats.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={() => exportToExcel(products, "Amazon_Product_Hunting")}
                        disabled={products.length === 0}
                        className="flex items-center justify-center gap-4 p-6 bg-sky-600 text-white rounded-[2rem] font-black text-lg hover:bg-sky-700 transition-all disabled:opacity-50 shadow-xl shadow-sky-500/20"
                      >
                        <Download className="w-6 h-6" /> Export Product Data
                      </button>
                      <button 
                        onClick={() => exportToExcel(sourcingOptions, "Amazon_Sourcing_Options")}
                        disabled={sourcingOptions.length === 0}
                        className="flex items-center justify-center gap-4 p-6 bg-white/5 text-white rounded-[2rem] font-black text-lg hover:bg-white/10 transition-all disabled:opacity-50 border border-white/5"
                      >
                        <Download className="w-6 h-6" /> Export Sourcing Data
                      </button>
                    </div>
                    {products.length === 0 && sourcingOptions.length === 0 && (
                      <div className="flex items-center justify-center gap-2 text-sky-500/60 font-black text-[10px] uppercase tracking-widest">
                        <Zap className="w-3 h-3 fill-sky-500/60" /> No data available to export
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeModule === "Profit Calculator" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-[#1e293b] p-8 rounded-3xl shadow-sm border border-white/5">
                    <h2 className="text-xl font-bold mb-6 text-white">Calculator Input</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Sale Price ($)</label>
                          <input 
                            type="number" 
                            className="w-full p-4 bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-sky-500 transition-all outline-none text-white"
                            placeholder="0.00"
                            id="calc-sale-price"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Product Cost ($)</label>
                          <input 
                            type="number" 
                            className="w-full p-4 bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-sky-500 transition-all outline-none text-white"
                            placeholder="0.00"
                            id="calc-cost"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Amazon Fees (%)</label>
                          <input 
                            type="number" 
                            className="w-full p-4 bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-sky-500 transition-all outline-none text-white"
                            placeholder="15"
                            id="calc-fees"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Shipping Cost ($)</label>
                          <input 
                            type="number" 
                            className="w-full p-4 bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-sky-500 transition-all outline-none text-white"
                            placeholder="0.00"
                            id="calc-shipping"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const salePrice = parseFloat((document.getElementById('calc-sale-price') as HTMLInputElement).value) || 0;
                          const cost = parseFloat((document.getElementById('calc-cost') as HTMLInputElement).value) || 0;
                          const feesPercent = parseFloat((document.getElementById('calc-fees') as HTMLInputElement).value) || 15;
                          const shipping = parseFloat((document.getElementById('calc-shipping') as HTMLInputElement).value) || 0;
                          
                          const amazonFees = salePrice * (feesPercent / 100);
                          const totalCost = cost + amazonFees + shipping;
                          const netProfit = salePrice - totalCost;
                          const margin = (netProfit / salePrice) * 100;

                          setListing({ 
                            title: `Net Profit: $${netProfit.toFixed(2)}`,
                            bulletPoints: [
                              `Amazon Fees: $${amazonFees.toFixed(2)}`,
                              `Total Cost: $${totalCost.toFixed(2)}`,
                              `Profit Margin: ${margin.toFixed(2)}%`
                            ],
                            description: `Calculated based on a sale price of $${salePrice} and total expenses of $${totalCost.toFixed(2)}.`,
                            backendSearchTerms: "",
                            keywords: []
                          } as any);
                        }}
                        className="w-full bg-sky-600 text-white py-4 rounded-2xl font-bold hover:bg-sky-700 transition-all"
                      >
                        Calculate Profit
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#1e293b] p-8 rounded-3xl shadow-sm border border-white/5">
                    {listing ? (
                      <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">Calculation Results</h2>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-6 bg-sky-500/10 rounded-3xl border border-sky-500/20">
                            <p className="text-sm text-sky-500 font-bold uppercase mb-1">Net Profit</p>
                            <p className="text-4xl font-black text-sky-400">{listing.title}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {listing.bulletPoints.map((bp, i) => (
                              <div key={i} className="p-4 bg-white/5 rounded-2xl">
                                <p className="text-sm font-bold text-gray-300">{bp}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 italic">{listing.description}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-600">
                        <Calculator className="w-16 h-16 mb-4 opacity-20" />
                        <p className="font-medium">Enter values to see profit analysis.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeModule === "Sourcing Finder" && (
                <div className="space-y-8">
                  <div className="bg-[#1e293b] p-16 rounded-[4rem] shadow-sm border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 blur-[150px] rounded-full -mr-64 -mt-64" />
                    
                    <div className="max-w-3xl mx-auto space-y-12 relative z-10">
                      <div className="text-center space-y-4">
                        <h2 className="text-5xl font-black text-white tracking-tight">AI Sourcing Finder</h2>
                        <p className="text-gray-500 text-xl font-medium">Upload an image or enter details to find the best global suppliers using AI reverse search.</p>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                          <Target className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-7 h-7" />
                          <input 
                            type="text"
                            placeholder="Enter ASIN, Product Name, or Keywords"
                            className="w-full pl-16 pr-8 py-6 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-[2.5rem] outline-none text-white font-bold text-lg transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <button 
                          onClick={() => handleSource(searchQuery, sourceImage || undefined)}
                          disabled={loading}
                          className="bg-sky-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-lg hover:bg-sky-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-sky-500/20 min-w-[260px]"
                        >
                          {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <><Zap className="w-7 h-7 fill-white" /> Find Best Source</>}
                        </button>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">OR REVERSE IMAGE SEARCH</span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>

                      <div className="flex justify-center">
                        <label className="w-full max-w-2xl cursor-pointer group">
                          <div className={cn(
                            "border-4 border-dashed rounded-[4rem] p-16 text-center transition-all duration-500",
                            sourceImage 
                              ? "border-sky-500 bg-sky-500/5" 
                              : "border-white/5 hover:border-sky-500/40 hover:bg-white/5"
                          )}>
                            {sourceImage ? (
                              <div className="relative inline-block">
                                <img src={sourceImage} alt="Source" className="w-64 h-64 object-cover rounded-[3rem] shadow-2xl border-4 border-[#1e293b]" />
                                <button 
                                  onClick={(e) => { e.preventDefault(); setSourceImage(null); }}
                                  className="absolute -top-6 -right-6 bg-red-500 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform"
                                >
                                  <X className="w-6 h-6" />
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-6">
                                <div className="w-24 h-24 bg-white/5 text-gray-600 rounded-[2.5rem] flex items-center justify-center mx-auto group-hover:text-sky-500 group-hover:bg-sky-500/10 transition-all duration-500">
                                  <Package className="w-12 h-12" />
                                </div>
                                <div>
                                  <p className="text-2xl font-black text-white">Drop product image here</p>
                                  <p className="text-gray-500 font-medium text-lg">AI will analyze the image to find exact matches</p>
                                </div>
                              </div>
                            )}
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => setSourceImage(reader.result as string);
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  {sourcingOptions.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {sourcingOptions.map((s) => (
                        <motion.div 
                          key={s.id}
                          whileHover={{ y: -12 }}
                          className="bg-[#1e293b] rounded-[3rem] shadow-sm border border-white/5 overflow-hidden group hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500"
                        >
                          <div className="p-10 space-y-8">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
                                <Globe className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.platform}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sky-500">
                                <Star className="w-5 h-5 fill-sky-500" />
                                <span className="text-lg font-black">{s.rating}</span>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-sky-500 transition-colors">{s.supplierName}</h3>
                              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                <MapPin className="w-4 h-4 text-sky-500" />
                                <span>{s.location}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Price/Unit</p>
                                <p className="text-2xl font-black text-sky-500">${s.price}</p>
                              </div>
                              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Min Order</p>
                                <p className="text-2xl font-black text-white">{s.moq} <span className="text-xs text-gray-500">Units</span></p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-4 pt-4">
                              <button 
                                onClick={() => setSelectedSupplier(s)}
                                className="w-full py-5 bg-white text-black rounded-[2rem] font-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-xl"
                              >
                                View Supplier <ArrowUpRight className="w-6 h-6" />
                              </button>
                              <button 
                                onClick={() => handleGenerateEmail("Inquiry", s.supplierName)}
                                className="w-full py-5 bg-sky-500/10 text-sky-500 rounded-[2rem] font-black hover:bg-sky-500/20 transition-all text-sm uppercase tracking-widest"
                              >
                                Contact Supplier
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Voice Command Overlay */}
      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-1/2 bg-[#0f172a]/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-6 border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="bg-[#1e293b] p-12 rounded-[3rem] shadow-2xl text-center max-w-lg w-full relative overflow-hidden border border-white/10">
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full" />
              
              <div className="relative mb-12">
                <div className="flex items-center justify-center gap-1 h-16 mb-8">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isVoiceProcessing ? [10, 40, 10] : [10, 20, 10],
                        backgroundColor: isVoiceProcessing ? "#0ea5e3" : "#38bdf8"
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                      className="w-1.5 rounded-full"
                    />
                  ))}
                </div>
                
                <div className="relative w-32 h-32 bg-sky-600 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-sky-500/40">
                  <Mic className={cn("w-16 h-16", isVoiceProcessing && "animate-pulse")} />
                  {isVoiceProcessing && (
                    <div className="absolute inset-0 border-4 border-sky-400 rounded-full animate-ping opacity-20" />
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    {isVoiceProcessing ? "Processing..." : "Listening..."}
                  </h2>
                  <div className="min-h-[60px] flex items-center justify-center">
                    <p className="text-xl font-medium text-sky-500 italic">
                      {voiceMessage || "How can I help you today?"}
                    </p>
                  </div>
                </div>

                {voiceTranscript && (
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-sm font-black text-gray-500 uppercase tracking-widest mb-2">You said:</p>
                    <p className="text-lg font-bold text-white italic">"{voiceTranscript}"</p>
                  </div>
                )}

                <div className="pt-8 flex flex-col gap-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Try saying</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Product Hunting", "Find Suppliers", "Generate Listing"].map(tip => (
                      <span key={tip} className="px-4 py-2 bg-white/5 text-gray-400 rounded-full text-xs font-bold">
                        "{tip}"
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    window.speechSynthesis.cancel();
                    setIsListening(false);
                    setVoiceContext(null);
                  }}
                  className="mt-8 px-12 py-4 bg-white text-black rounded-2xl font-black hover:scale-[1.02] transition-all shadow-xl"
                >
                  Close Assistant
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Supplier Detail Popup */}
      <AnimatePresence>
        {selectedSupplier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSupplier(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-[#1e293b] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-white/10"
            >
              {/* Left Side: Images & Quick Info */}
              <div className="w-full md:w-2/5 bg-[#0f172a] p-8 flex flex-col gap-6 overflow-y-auto">
                <div className="aspect-square bg-white/5 rounded-[2rem] overflow-hidden shadow-inner flex items-center justify-center border border-white/5">
                  <Package className="w-20 h-20 text-sky-500/20" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="aspect-square bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center">
                      <Package className="w-6 h-6 text-sky-500/20" />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <MapPin className="w-5 h-5 text-sky-500" />
                    <span className="text-sm font-bold">{selectedSupplier.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Phone className="w-5 h-5 text-sky-500" />
                    <span className="text-sm font-bold">+1 (555) 0123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Mail className="w-5 h-5 text-sky-500" />
                    <span className="text-sm font-bold">{selectedSupplier.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Globe className="w-5 h-5 text-sky-500" />
                    <span className="text-sm font-bold">www.{selectedSupplier.supplierName.toLowerCase().replace(/\s/g, '')}.com</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Details & Actions */}
              <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                <button 
                  onClick={() => setSelectedSupplier(null)}
                  className="absolute top-8 right-8 p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>

                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-sky-500/10 text-sky-400 text-[10px] font-black rounded-full uppercase tracking-widest">Verified Supplier</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <span className="text-sm font-black">{selectedSupplier.rating}</span>
                    </div>
                  </div>
                  <h2 className="text-4xl font-black text-white">{selectedSupplier.supplierName}</h2>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Sourcing Platform</p>
                    <p className="text-lg font-bold text-white">{selectedSupplier.platform}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Lead Time</p>
                    <p className="text-lg font-bold text-white">15-20 Days</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Unit Price</p>
                    <p className="text-2xl font-black text-sky-500">${selectedSupplier.price}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Minimum Order</p>
                    <p className="text-2xl font-black text-white">{selectedSupplier.moq} Units</p>
                  </div>
                </div>

                <div className="bg-white/5 p-8 rounded-[2.5rem] mb-8">
                  <h4 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-sky-500" /> Supplier Description
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Specialized in high-quality manufacturing with over 10 years of experience in the industry. 
                    Known for consistent quality control, timely shipping, and excellent communication. 
                    Offers OEM/ODM services and custom packaging for Amazon FBA sellers.
                  </p>
                </div>

                <div className="flex gap-4">
                  <a 
                    href={selectedSupplier.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-5 bg-sky-600 text-white rounded-3xl font-black hover:bg-sky-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20"
                  >
                    Visit Website <ExternalLink className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => {
                      handleGenerateEmail("Inquiry", selectedSupplier.supplierName);
                      setSelectedSupplier(null);
                    }}
                    className="flex-1 py-5 bg-white text-black rounded-3xl font-black hover:scale-[1.02] transition-all"
                  >
                    Contact Supplier
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Live Profit Calculator Panel */}
      <AnimatePresence>
        {isCalculatorOpen && (
          <motion.aside
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="fixed right-0 top-0 h-full w-96 bg-[#0f172a] border-l border-white/5 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500">
                  <Calculator className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">Profit Calculator</h2>
              </div>
              <button 
                onClick={() => setIsCalculatorOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              <div className="space-y-6">
                {[
                  { label: "Amazon Selling Price", key: "sellingPrice", icon: DollarSign },
                  { label: "Product Cost", key: "productCost", icon: Package },
                  { label: "Amazon Fees", key: "amazonFees", icon: Target },
                  { label: "Shipping Cost", key: "shippingCost", icon: Globe }
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <field.icon className="w-3 h-3" /> {field.label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                      <input 
                        type="number"
                        value={calcInputs[field.key as keyof typeof calcInputs]}
                        onChange={(e) => setCalcInputs(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) || 0 }))}
                        className="w-full pl-8 pr-4 py-4 bg-white/5 border-2 border-transparent focus:border-sky-500/20 rounded-2xl focus:ring-4 focus:ring-sky-500/5 transition-all outline-none font-bold text-lg text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className={cn(
                "p-8 rounded-[2.5rem] space-y-6 transition-colors duration-500",
                profit >= 0 ? "bg-sky-500/10 border border-sky-500/20" : "bg-red-500/10 border border-red-500/20"
              )}>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-sky-200">Estimated Net Profit</p>
                  <p className={cn("text-5xl font-black tracking-tighter", profit >= 0 ? "text-sky-500" : "text-red-500")}>
                    ${profit.toFixed(2)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-sky-200">ROI</p>
                    <p className="text-xl font-black text-white">{roi.toFixed(1)}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-sky-200">Margin</p>
                    <p className="text-xl font-black text-white">{margin.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* AI Floating Assistant Button */}
      {!isAssistantOpen && (
        <div className="fixed bottom-8 right-8 z-[100]">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAssistantOpen(true)}
            className="w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 group relative overflow-hidden border border-white/10 bg-sky-500 text-white hover:shadow-sky-500/40"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap className="w-10 h-10 fill-white drop-shadow-lg" />
            <div className="absolute inset-0 bg-sky-400 rounded-full animate-ping opacity-20" />
          </motion.button>
        </div>
      )}

      {/* AI Side Panel Assistant */}
      <AnimatePresence>
        {isAssistantOpen && (
          <>
            {/* Very light overlay for mobile or subtle focus */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssistantOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[90] md:bg-transparent md:backdrop-blur-0"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : `${assistantWidth}px` }}
              className="fixed top-0 right-0 h-full bg-[#0f172a] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-[100] flex flex-col border-l border-white/10"
            >
              {/* Resize Handle */}
              <div 
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizing(true);
                }}
                className="absolute left-0 top-0 w-1.5 h-full cursor-col-resize hover:bg-sky-500/50 transition-colors z-[110] hidden md:block"
              />

              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-sky-500 to-sky-600 text-white flex items-center justify-between relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
                    <Zap className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <p className="text-base font-black tracking-tight">Omiseller AI</p>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      <p className="text-[9px] font-black opacity-80 uppercase tracking-widest">System Online</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsAssistantOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-all relative z-10 border border-transparent hover:border-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[#0f172a]/40">
                {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <BrainCircuit className="w-10 h-10 text-sky-500" />
                    <p className="text-xs font-medium max-w-[180px]">How can I help you with your Amazon business today?</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    key={i}
                    className={cn(
                      "max-w-[90%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "bg-sky-500 text-white ml-auto rounded-tr-none shadow-sky-500/20" 
                        : "bg-white/5 text-white mr-auto rounded-tl-none border border-white/5"
                    )}
                  >
                    {msg.text}
                  </motion.div>
                ))}
              </div>

              {/* Input Area */}
              <form onSubmit={handleChatSubmit} className="p-6 bg-[#0f172a]/60 backdrop-blur-xl border-t border-white/5 space-y-4 shrink-0">
                {isAssistantListening && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-sky-500"
                  >
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-1 h-1 bg-sky-500 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest">AI is listening...</span>
                  </motion.div>
                )}
                <div className="flex gap-3">
                  <div className="relative flex-1 group">
                    <div className="absolute inset-0 bg-sky-500/5 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <input 
                      type="text"
                      placeholder="Type your question..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/20 outline-none font-medium text-white transition-all relative z-10"
                    />
                    <button 
                      type="button"
                      onClick={startAssistantVoiceInput}
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all z-20",
                        isAssistantListening ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-gray-500 hover:text-sky-500 hover:bg-sky-500/10"
                      )}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                  <button type="submit" className="p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/20 hover:scale-105 active:scale-95">
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-sky-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-black flex items-center gap-3 z-[100]"
          >
            <Check className="w-5 h-5" />
            Email copied successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
