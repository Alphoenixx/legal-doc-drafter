import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import 'package:url_launcher/url_launcher.dart';

class PdfViewerScreen extends StatelessWidget {
  final String title;
  final String pdfUrl;

  const PdfViewerScreen({super.key, required this.title, required this.pdfUrl});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        actions: [
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: () async {
              final url = Uri.parse(pdfUrl);
              if (await canLaunchUrl(url)) {
                await launchUrl(url, mode: LaunchMode.externalApplication);
              } else {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Could not launch download URL')),
                  );
                }
              }
            },
          ),
        ],
      ),
      body: SfPdfViewer.network(
        pdfUrl,
        canShowScrollHead: false,
        canShowScrollStatus: false,
        enableDoubleTapZooming: true,
      ),
    );
  }
}
