
import { pipeline } from '@xenova/transformers';

/**
 * This class uses the Singleton pattern to ensure that only one instance of the
 * pipeline is loaded. This is because loading the pipeline is an expensive
 * operation and we don't want to do it every time we want to translate a sentence.
 */
class MyGenerativePipeline {
    static task = 'text-generation';
    static model = 'google/gemma-2-2b';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback});
            
        }

        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    // Retrieve the translation pipeline. When called for the first time,
    // this will load the pipeline and save it for future use.
    let generator = await MyGenerativePipeline.getInstance(x => {
        // We also add a progress callback to the pipeline so that we can
        // track model loading.
        self.postMessage(x);
    });

    // Actually perform the translation
    let output = await generator(event.data.prompt, {
        max_length: event.data.max_length || 100, // Set maximum length for the generated text
        num_return_sequences: event.data.num_return_sequences || 1, // Number of outputs to generate
        temperature: event.data.temperature || 1.0, // Sampling temperature
        top_p: event.data.top_p || 0.9, // Nucleus sampling
        callback_function: x => {
            // Send partial outputs back to the main thread (if applicable)
            self.postMessage({
                status: 'update',
                output: generator.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true })
            });
        }
    });


    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: output,
    });
});
