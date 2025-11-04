/**
 * 🎨 APP ICONS - LUCIDE CENTRALIZED
 * Sistema centralizado de ícones usando Lucide React
 */

import {
	// Actions
	Save,
	Edit3,
	Trash2,
	Plus,
	Copy,
	Share2,
	Download,
	Upload,
	RotateCcw,
	RotateCw,

	// Navigation
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	ArrowDown,
	Menu,
	X,
	Home,
	ChevronDown,
	ChevronUp,
	ChevronLeft,
	ChevronRight,

	// Analytics & Charts
	BarChart3,
	LineChart,
	PieChart,
	TrendingUp,
	TrendingDown,
	Activity,
	Target,
	Zap,

	// Status & Feedback
	CheckCircle,
	AlertCircle,
	AlertTriangle,
	Info,
	Clock,
	Calendar,

	// Media & Content
	Image,
	FileText,
	Link2,
	Globe,
	Monitor,
	Smartphone,
	Tablet,

	// User & Profile
	User,
	Users,
	Settings,
	Shield,
	Eye,
	EyeOff,
	LogOut,
	LogIn,

	// Communication
	Mail,
	MessageCircle,
	Bell,
	BellOff,

	// Tools & Utilities
	Search,
	Filter,
	SlidersHorizontal,
	Maximize,
	Minimize,
	MoreHorizontal,
	MoreVertical,

	// Data & Files
	Database,
	Folder,
	FolderOpen,
	File,
	FileSpreadsheet,

	// Maps & Location
	MapPin,
	Map,
	Navigation,

	// QR & Codes
	QrCode,
	Scan,

	// Time & Schedule
	Timer,
	Clock3,
	History,

	// Business
	Briefcase,
	Building,
	CreditCard,
	DollarSign,

	// Social & Marketing
	Facebook,
	Twitter,
	Instagram,
	Linkedin,
	Github,

	// Advanced
	Code,
	Terminal,
	Bug,
	Wrench,
	Cpu
} from 'lucide-react';

// ========================================
// 🎯 ICON MAPPING
// ========================================

/**
 * Mapeamento centralizado de ícones por categoria e função
 */
export const AppIcons = {
	// ========================================
	// 🎬 ACTIONS
	// ========================================
	actions: {
		save: Save,
		edit: Edit3,
		delete: Trash2,
		create: Plus,
		add: Plus,
		copy: Copy,
		share: Share2,
		download: Download,
		upload: Upload,
		refresh: RotateCcw,
		reload: RotateCw,
		reset: RotateCcw
	},

	// ========================================
	// 🧭 NAVIGATION
	// ========================================
	navigation: {
		back: ArrowLeft,
		forward: ArrowRight,
		up: ArrowUp,
		down: ArrowDown,
		menu: Menu,
		close: X,
		home: Home,
		expand: ChevronDown,
		collapse: ChevronUp,
		next: ChevronRight,
		prev: ChevronLeft
	},

	// ========================================
	// 📊 ANALYTICS & CHARTS
	// ========================================
	analytics: {
		chart: BarChart3,
		line: LineChart,
		pie: PieChart,
		trending: TrendingUp,
		decline: TrendingDown,
		activity: Activity,
		target: Target,
		performance: Zap,
		analytics: BarChart3
	},

	// ========================================
	// ✅ STATUS & FEEDBACK
	// ========================================
	status: {
		success: CheckCircle,
		error: AlertCircle,
		warning: AlertTriangle,
		info: Info,
		loading: RotateCcw,
		pending: Clock,
		scheduled: Calendar
	},

	// ========================================
	// 🌐 CONTENT & MEDIA
	// ========================================
	content: {
		link: Link2,
		url: Globe,
		image: Image,
		text: FileText,
		desktop: Monitor,
		mobile: Smartphone,
		tablet: Tablet
	},

	// ========================================
	// 👤 USER & PROFILE
	// ========================================
	user: {
		profile: User,
		users: Users,
		settings: Settings,
		security: Shield,
		show: Eye,
		hide: EyeOff,
		login: LogIn,
		logout: LogOut
	},

	// ========================================
	// 💬 COMMUNICATION
	// ========================================
	communication: {
		email: Mail,
		message: MessageCircle,
		notification: Bell,
		mute: BellOff
	},

	// ========================================
	// 🔧 TOOLS & UTILITIES
	// ========================================
	tools: {
		search: Search,
		filter: Filter,
		adjust: SlidersHorizontal,
		expand: Maximize,
		minimize: Minimize,
		more: MoreHorizontal,
		menu: MoreVertical,
		code: Code,
		terminal: Terminal,
		debug: Bug,
		config: Wrench
	},

	// ========================================
	// 📁 DATA & FILES
	// ========================================
	data: {
		database: Database,
		folder: Folder,
		folderOpen: FolderOpen,
		file: File,
		spreadsheet: FileSpreadsheet
	},

	// ========================================
	// 🗺️ MAPS & LOCATION
	// ========================================
	location: {
		pin: MapPin,
		map: Map,
		navigate: Navigation
	},

	// ========================================
	// 📱 QR & CODES
	// ========================================
	codes: {
		qr: QrCode,
		scan: Scan
	},

	// ========================================
	// ⏰ TIME & SCHEDULE
	// ========================================
	time: {
		timer: Timer,
		stopwatch: Clock3,
		history: History,
		calendar: Calendar,
		clock: Clock,
		schedule: Calendar
	},

	// ========================================
	// 💼 BUSINESS
	// ========================================
	business: {
		briefcase: Briefcase,
		building: Building,
		card: CreditCard,
		money: DollarSign
	},

	// ========================================
	// 📱 SOCIAL & MARKETING
	// ========================================
	social: {
		facebook: Facebook,
		twitter: Twitter,
		instagram: Instagram,
		linkedin: Linkedin,
		github: Github
	},

	// ========================================
	// ⚡ ADVANCED
	// ========================================
	advanced: {
		cpu: Cpu,
		performance: Zap,
		activity: Activity
	}
} as const;

// ========================================
// 🎯 TYPE DEFINITIONS
// ========================================

export type IconCategory = keyof typeof AppIcons;
export type IconName<T extends IconCategory> = keyof (typeof AppIcons)[T];
export type AnyIconName = {
	[K in IconCategory]: `${K}.${string & IconName<K>}`;
}[IconCategory];

// Flat icon mapping for easy access
export const FlatAppIcons = Object.entries(AppIcons).reduce(
	(acc, [category, icons]) => {
		Object.entries(icons).forEach(([name, icon]) => {
			acc[`${category}.${name}` as AnyIconName] = icon;
		});
		return acc;
	},
	{} as Record<AnyIconName, any>
);

// ========================================
// 🎨 ICON INTENTS (Semantic Mapping)
// ========================================

export const IconIntents = {
	// Form actions
	save: AppIcons.actions.save,
	edit: AppIcons.actions.edit,
	delete: AppIcons.actions.delete,
	create: AppIcons.actions.create,
	cancel: AppIcons.navigation.close,
	reset: AppIcons.actions.reset,

	// Navigation
	back: AppIcons.navigation.back,
	forward: AppIcons.navigation.forward,
	menu: AppIcons.navigation.menu,
	expand: AppIcons.navigation.expand,
	collapse: AppIcons.navigation.collapse,

	// Content actions
	copy: AppIcons.actions.copy,
	share: AppIcons.actions.share,
	download: AppIcons.actions.download,

	// Analytics
	analytics: AppIcons.analytics.analytics,
	chart: AppIcons.analytics.chart,
	trending: AppIcons.analytics.trending,

	// Status
	success: AppIcons.status.success,
	error: AppIcons.status.error,
	warning: AppIcons.status.warning,
	info: AppIcons.status.info,
	loading: AppIcons.status.loading,

	// QR & Links
	qr: AppIcons.codes.qr,
	link: AppIcons.content.link,
	url: AppIcons.content.url,

	// Time
	schedule: AppIcons.time.schedule,

	// User
	profile: AppIcons.user.profile,
	settings: AppIcons.user.settings,
	logout: AppIcons.user.logout
} as const;

export type IconIntent = keyof typeof IconIntents;
