import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-6xl font-display font-bold text-white mb-4">404</h1>
            <p className="text-muse-text-muted mb-8 max-w-md">
                The rhythm seems to have skipped a beat. The page you're looking for doesn't exist.
            </p>
            <Link 
                href="/" 
                className="px-8 py-3 rounded-full bg-muse-primary hover:bg-muse-primary-light text-white font-bold transition-all"
            >
                Back to the Music
            </Link>
        </div>
    );
}
