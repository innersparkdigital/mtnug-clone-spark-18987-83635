/**
 * Wraps a Supabase query/RPC promise so a stalled request (common on slow
 * mobile networks) resolves with an error instead of leaving the UI spinning
 * forever.
 */
export async function withTimeout<T>(
  promise: PromiseLike<{ data: T | null; error: { message: string } | null }>,
  ms = 20000,
  label = "Request",
): Promise<{ data: T | null; error: { message: string } | null }> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<{ data: null; error: { message: string } }>((resolve) => {
    timer = setTimeout(
      () => resolve({ data: null, error: { message: `${label} timed out. Check your connection and retry.` } }),
      ms,
    );
  });
  try {
    return await Promise.race([Promise.resolve(promise), timeout]);
  } finally {
    clearTimeout(timer!);
  }
}
