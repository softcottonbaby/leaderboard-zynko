import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <div className="bg-grid flex flex-col min-h-screen relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={router.route}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex-grow"
        >
          <Component {...pageProps} />
        </motion.main>
      </AnimatePresence>

      <footer className="mt-auto z-10 relative">
      </footer>
    </div>
  );
}