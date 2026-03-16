import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

class PdfViewerScreen extends StatelessWidget {
  final String title;
  final String pdfUrl;

  const PdfViewerScreen({super.key, required this.title, required this.pdfUrl});

  @override
  Widget build(BuildContext context) {
    final trimmedUrl = pdfUrl.trim();
    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        actions: [
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: () async {
              if (trimmedUrl.isEmpty) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Missing PDF URL')),
                  );
                }
                return;
              }

              final url = Uri.parse(trimmedUrl);
              // Avoid in-app WebView for downloads: it can crash on some devices with SSL errors.
              final launched = await launchUrl(url, mode: LaunchMode.externalApplication);
              if (launched) return;

              if (!context.mounted) return;

              // Fallback: let user copy the URL.
              await showDialog<void>(
                context: context,
                builder: (context) {
                  return AlertDialog(
                    title: const Text('Open PDF'),
                    content: SelectableText(trimmedUrl),
                    actions: [
                      TextButton(
                        onPressed: () async {
                          await Clipboard.setData(ClipboardData(text: trimmedUrl));
                          if (context.mounted) {
                            Navigator.pop(context);
                          }
                        },
                        child: const Text('Copy link'),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Close'),
                      ),
                    ],
                  );
                },
              );
            },
          ),
        ],
      ),
      body: SfPdfViewer.network(
        trimmedUrl,
        canShowScrollHead: false,
        canShowScrollStatus: false,
        enableDoubleTapZooming: true,
      ),
    );
  }
}
