import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import 'package:docx_to_text/docx_to_text.dart';
import 'dart:io';
import 'dart:typed_data';

class LocalFilePreviewDialog extends StatefulWidget {
  final PlatformFile file;

  const LocalFilePreviewDialog({super.key, required this.file});

  @override
  State<LocalFilePreviewDialog> createState() => _LocalFilePreviewDialogState();
}

class _LocalFilePreviewDialogState extends State<LocalFilePreviewDialog> {
  Widget? customPreviewWidget;
  String previewText = "Loading preview...";
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPreview();
  }

  Future<void> _loadPreview() async {
    bool isDocx = widget.file.name.toLowerCase().endsWith('.docx');
    bool isPdf = widget.file.name.toLowerCase().endsWith('.pdf');

    List<int>? fileBytes = widget.file.bytes;
    if (fileBytes == null && widget.file.path != null) {
      try {
        fileBytes = await File(widget.file.path!).readAsBytes();
      } catch (e) {
        debugPrint('Failed to read file for preview: $e');
      }
    }

    if (isPdf && fileBytes != null) {
      customPreviewWidget = SfPdfViewer.memory(Uint8List.fromList(fileBytes));
    } else if (isDocx && fileBytes != null) {
      try {
        final text = docxToText(Uint8List.fromList(fileBytes));
        previewText = text;
      } catch (e) {
        previewText = "Unable to parse DOCX file. It may be corrupted or unsupported.";
      }
    } else if (fileBytes != null) {
       try {
         final text = String.fromCharCodes(fileBytes);
         previewText = text;
       } catch (e) {
         previewText = "Unable to render binary preview.";
       }
    } else {
      previewText = "File data is currently unavailable in memory.";
    }

    if (mounted) {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF1A2332),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        padding: const EdgeInsets.all(24),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.9, 
          maxHeight: MediaQuery.of(context).size.height * 0.9
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.description, color: Color(0xFF2DD4BF)),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    widget.file.name, 
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.grey),
                  onPressed: () => Navigator.pop(context),
                )
              ],
            ),
            const Divider(height: 32, color: Colors.grey),
            Expanded(
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF0B0F14),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey.withValues(alpha: 0.2)),
                ),
                child: isLoading 
                  ? const Center(child: CircularProgressIndicator(color: Color(0xFF2DD4BF)))
                  : customPreviewWidget ?? InteractiveViewer(
                      constrained: false,
                      minScale: 0.5,
                      maxScale: 4.0,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        child: Text(
                          previewText,
                          style: const TextStyle(fontFamily: 'monospace', fontSize: 13, height: 1.5),
                        ),
                      ),
                    ),
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Close Preview', style: TextStyle(color: Colors.grey)),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                       Navigator.pop(context);
                    },
                    icon: const Icon(Icons.check),
                    label: const Text('Confirm Selection', overflow: TextOverflow.ellipsis),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
